import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB connected');

    // Heartbeat: Ping MongoDB every 4 minutes to keep socket connection alive during long idle periods
    setInterval(async () => {
      try {
        if (mongoose.connection.readyState === 1) {
          await mongoose.connection.db.admin().ping();
          // Heartbeat ping successful, socket remains active
        }
      } catch (err) {
        console.warn('⚠️ MongoDB heartbeat ping error:', err.message);
      }
    }, 4 * 60 * 1000);

    // Auto-reconnect handling for network dropouts
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB connection lost. Mongoose will attempt reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✓ MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;

