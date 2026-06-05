import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    fileSize: { type: Number },
    filePath: { type: String },
    totalChunks: { type: Number, default: 0 },
    status: { type: String, enum: ['processing', 'indexed', 'failed'], default: 'processing' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Document', documentSchema);
