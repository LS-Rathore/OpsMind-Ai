import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import Chunk from './src/models/Chunk.js';
import { retrieveRelevantChunks } from './src/services/retriever.js';

dotenv.config();

async function run() {
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!');

  const count = await Chunk.countDocuments();
  console.log('Total chunks in database:', count);

  const queryText = 'policy';
  console.log(`Testing query embedding for: "${queryText}"`);
  
  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: 'gemini-embedding-2',
    apiKey: process.env.GEMINI_API_KEY,
  });

  try {
    const queryVector = await embeddings.embedQuery(queryText);
    console.log('Query vector embedded successfully. Dimension:', queryVector.length);

    console.log('Executing retrieveRelevantChunks...');
    const results = await retrieveRelevantChunks(queryText, 5);

    console.log('Results length:', results.length);
    console.log('Results:', JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Error during vector search:', err);
  } finally {
    await mongoose.connection.close();
  }
}

run();
