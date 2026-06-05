import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  sources: [
    {
      filename: String,
      pageNumber: Number,
      text: String,
    },
  ],
  tokenCount: { type: Number },
  responseTimeMs: { type: Number },
  isHallucination: { type: Boolean, default: false },
  feedback: { type: String, enum: ['up', 'down', null], default: null },
  createdAt: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New Conversation' },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);
