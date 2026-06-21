import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import mongoose from 'mongoose';
import Chunk from '../models/Chunk.js';

export const retrieveRelevantChunks = async (queryText, topK = 5, userId = null) => {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: 'gemini-embedding-2',
    apiKey: process.env.GEMINI_API_KEY,
  });

  const queryVector = await embeddings.embedQuery(queryText);

  // Build visibility filter: public chunks + current user's private chunks
  const visibilityFilter = userId
    ? { $or: [{ visibility: 'public' }, { uploadedBy: new mongoose.Types.ObjectId(userId) }] }
    : { visibility: 'public' };

  let results = [];
  try {
    results = await Chunk.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector,
          numCandidates: 100,
          limit: topK * 3, // Fetch extra to account for filtering
        },
      },
      {
        $match: visibilityFilter,
      },
      {
        $limit: topK,
      },
      {
        $project: {
          text: 1,
          filename: 1,
          pageNumber: 1,
          chunkIndex: 1,
          documentId: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);
  } catch (error) {
    console.warn('Atlas Vector Search failed or index not found. Using in-memory fallback:', error.message);
  }

  // Fallback: If Atlas vector search returns 0 results (e.g. index not created/ready)
  if (!results || results.length === 0) {
    console.log('No vector search results. Calculating in-memory cosine similarity...');
    const allChunks = await Chunk.find(visibilityFilter);
    
    const cosineSimilarity = (vecA, vecB) => {
      if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;
      for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
      }
      if (normA === 0 || normB === 0) return 0;
      return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    };

    const scored = allChunks
      .map(chunk => {
        const score = cosineSimilarity(queryVector, chunk.embedding);
        return {
          _id: chunk._id,
          text: chunk.text,
          filename: chunk.filename,
          pageNumber: chunk.pageNumber,
          chunkIndex: chunk.chunkIndex,
          documentId: chunk.documentId,
          score
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    results = scored;
  }

  return results;
};