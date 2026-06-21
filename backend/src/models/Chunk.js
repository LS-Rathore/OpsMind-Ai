import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    filename: { type: String, required: true },
    pageNumber: { type: Number },
    chunkIndex: { type: Number, required: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  },
  { timestamps: true }
);

export default mongoose.model('Chunk', chunkSchema);
