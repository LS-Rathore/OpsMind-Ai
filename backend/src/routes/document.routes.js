import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Document from '../models/Document.js';
import Chunk from '../models/Chunk.js';
import AuditLog from '../models/AuditLog.js';
import { parsePDFToChunks } from '../services/pdfParser.js';
import { embedChunks } from '../services/embedder.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

router.post('/upload', verifyToken, upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    const filename = `${uuidv4()}-${file.originalname}`;

    // Save the original PDF to disk for later viewing
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, file.buffer);

    const doc = await Document.create({
      filename,
      originalName: file.originalname,
      fileSize: file.size,
      filePath: filePath,
      uploadedBy: req.user.id,
      status: 'processing',
    });

    const chunks = await parsePDFToChunks(filePath, file.originalname);
    const embeddedChunks = await embedChunks(chunks);

    const chunkDocs = embeddedChunks.map((chunk) => ({
      documentId: doc._id,
      filename: file.originalname,
      pageNumber: chunk.pageNumber,
      chunkIndex: chunk.chunkIndex,
      text: chunk.text,
      embedding: chunk.embedding,
    }));

    await Chunk.insertMany(chunkDocs);

    doc.status = 'indexed';
    doc.totalChunks = chunkDocs.length;
    await doc.save();

    // Audit log
    await AuditLog.create({
      userId: req.user.id,
      action: 'document_upload',
      targetType: 'document',
      targetId: doc._id,
      details: { filename: file.originalname, chunks: chunkDocs.length, fileSize: file.size },
    });

    res.status(201).json({
      success: true,
      documentId: doc._id,
      filename: file.originalname,
      chunksStored: chunkDocs.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const documents = await Document.find()
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name email');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the original PDF for the in-app viewer
router.get('/:documentId/view', verifyToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const doc = await Document.findById(documentId);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (!doc.filePath || !fs.existsSync(doc.filePath)) {
      return res.status(404).json({ error: 'PDF file not found on disk. It may have been uploaded before file storage was enabled.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${doc.originalName}"`);
    const fileStream = fs.createReadStream(doc.filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:documentId/reindex', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { documentId } = req.params;
    const doc = await Document.findById(documentId);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete existing chunks
    await Chunk.deleteMany({ documentId });
    doc.status = 'processing';
    await doc.save();

    if (!doc.filePath || !fs.existsSync(doc.filePath)) {
      doc.status = 'indexed';
      doc.totalChunks = 0;
      await doc.save();
      return res.status(400).json({ error: 'PDF file not found on disk. Cannot reindex. Please re-upload.' });
    }

    const chunks = await parsePDFToChunks(doc.filePath, doc.originalName);
    const embeddedChunks = await embedChunks(chunks);

    const chunkDocs = embeddedChunks.map((chunk) => ({
      documentId: doc._id,
      filename: doc.originalName,
      pageNumber: chunk.pageNumber,
      chunkIndex: chunk.chunkIndex,
      text: chunk.text,
      embedding: chunk.embedding,
    }));

    await Chunk.insertMany(chunkDocs);

    doc.status = 'indexed';
    doc.totalChunks = chunkDocs.length;
    await doc.save();

    await AuditLog.create({
      userId: req.user.id,
      action: 'document_reindex',
      targetType: 'document',
      targetId: doc._id,
      details: { filename: doc.originalName, chunks: chunkDocs.length },
    });

    res.json({ success: true, message: 'Document reindexed successfully.', chunks: chunkDocs.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:documentId', verifyToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const doc = await Document.findById(documentId);

    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Allow deletion if user is admin OR the original uploader
    const isOwner = doc.uploadedBy && doc.uploadedBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'You can only delete documents you uploaded' });
    }

    const deletedChunks = await Chunk.deleteMany({ documentId });
    await Document.findByIdAndDelete(documentId);

    // Audit log
    await AuditLog.create({
      userId: req.user.id,
      action: 'document_delete',
      targetType: 'document',
      targetId: documentId,
      details: { filename: doc?.originalName, deletedChunks: deletedChunks.deletedCount },
    });

    res.json({
      success: true,
      message: 'Document and chunks deleted',
      deletedChunks: deletedChunks.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;