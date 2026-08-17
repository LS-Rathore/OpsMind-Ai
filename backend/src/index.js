import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import documentRoutes from './routes/document.routes.js';
import chatRoutes from './routes/chat.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), service: 'OpsMind AI' });
});

// MongoDB-specific health check — used by the keep-alive GitHub Action
app.get('/health/db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

    if (dbState === 1) {
      await mongoose.connection.db.admin().ping();
      res.json({
        status: 'ok',
        database: 'connected',
        timestamp: new Date(),
        service: 'OpsMind AI — MongoDB',
      });
    } else {
      res.status(503).json({
        status: 'degraded',
        database: stateMap[dbState] || 'unknown',
        timestamp: new Date(),
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'unreachable',
      error: error.message,
      timestamp: new Date(),
    });
  }
});

app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ OpsMind AI running at http://localhost:${PORT}`);
  });
});
