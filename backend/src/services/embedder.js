import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

const BATCH_SIZE = 10;

export const embedChunks = async (chunks) => {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: 'gemini-embedding-2',
    apiKey: process.env.GEMINI_API_KEY,
  });

  const totalBatches = Math.ceil(chunks.length / BATCH_SIZE);

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
    console.log(`Embedding batch ${batchIndex}/${totalBatches}`);

    const batch = chunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map((c) => c.text);
    const vectors = await embeddings.embedDocuments(texts);

    batch.forEach((chunk, idx) => {
      chunk.embedding = vectors[idx];
    });
  }

  return chunks;
};