import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 150;

export const parseDocumentToChunks = async (filePath, filename) => {
  let isTempFile = false;
  let targetFilePath = filePath;

  // If filePath is a buffer, we need to save it to a temp file first for processing
  if (Buffer.isBuffer(filePath)) {
    targetFilePath = path.join(process.cwd(), `temp-${uuidv4()}${path.extname(filename)}`);
    fs.writeFileSync(targetFilePath, filePath);
    isTempFile = true;
  }

  const ext = path.extname(filename).toLowerCase();

  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
    });

    if (ext === '.pdf') {
      const loader = new PDFLoader(targetFilePath, {
        splitPages: true,
      });
      const rawDocs = await loader.load();
      const splitDocs = await splitter.splitDocuments(rawDocs);

      const chunks = splitDocs.map((doc, index) => ({
        chunkIndex: index,
        text: doc.pageContent,
        pageNumber: doc.metadata.loc?.pageNumber || 1,
      }));

      console.log(`✓ ${filename}: ${chunks.length} chunks produced`);
      return chunks;
    } 
    
    // For DOCX, TXT, CSV: Extract text and split
    let rawText = '';
    
    if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: targetFilePath });
      rawText = result.value;
    } else if (ext === '.txt' || ext === '.csv') {
      rawText = fs.readFileSync(targetFilePath, 'utf-8');
    } else {
      throw new Error(`Unsupported file type: ${ext}`);
    }

    const splitTexts = await splitter.splitText(rawText);
    
    const chunks = splitTexts.map((text, index) => ({
      chunkIndex: index,
      text: text,
      // For non-PDFs, we just assign page 1
      pageNumber: 1,
    }));

    console.log(`✓ ${filename}: ${chunks.length} chunks produced`);
    return chunks;

  } finally {
    if (isTempFile && fs.existsSync(targetFilePath)) {
      fs.unlinkSync(targetFilePath);
    }
  }
};
