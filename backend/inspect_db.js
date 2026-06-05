import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Chunk from './src/models/Chunk.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const oneChunk = await Chunk.findOne({ embedding: { $exists: true } });
  if (oneChunk) {
    console.log('Embedding length in DB:', oneChunk.embedding.length);
  } else {
    console.log('No chunks with embedding found');
  }
  await mongoose.connection.close();
}

run();
