import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  try {
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));

    const chunksColl = db.collection('chunks');
    const indexes = await chunksColl.listIndexes().toArray();
    console.log('Standard indexes on chunks:', indexes);

    // List Atlas Search/Vector search indexes
    console.log('Listing Search/Vector search indexes...');
    const searchIndexesCursor = await chunksColl.listSearchIndexes();
    const searchIndexes = await searchIndexesCursor.toArray();
    console.log('Search/Vector search indexes:', JSON.stringify(searchIndexes, null, 2));
  } catch (err) {
    console.error('Error listing search indexes:', err);
  } finally {
    await mongoose.connection.close();
  }
}

run();
