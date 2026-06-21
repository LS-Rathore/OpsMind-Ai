import { Router } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import User from '../models/User.js';
import Document from '../models/Document.js';
import Chunk from '../models/Chunk.js';
import Conversation from '../models/Conversation.js';
import AuditLog from '../models/AuditLog.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// ─── USER MANAGEMENT ────────────────────────────────────────────

router.get('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const tempPassword = password || crypto.randomBytes(8).toString('hex');
    const user = await User.create({ name, email, password: tempPassword, role: role || 'user' });

    await AuditLog.create({
      userId: req.user.id,
      action: 'user_create',
      targetType: 'user',
      targetId: user._id,
      details: { name, email, role: role || 'user' },
    });

    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      tempPassword,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id/deactivate', verifyToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    await AuditLog.create({
      userId: req.user.id,
      action: 'user_deactivate',
      targetType: 'user',
      targetId: user._id,
      details: { email: user.email },
    });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id/activate', verifyToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    await AuditLog.create({
      userId: req.user.id,
      action: 'user_activate',
      targetType: 'user',
      targetId: user._id,
      details: { email: user.email },
    });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id/reset-password', verifyToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newPassword = crypto.randomBytes(8).toString('hex');
    user.password = newPassword;
    await user.save();

    await AuditLog.create({
      userId: req.user.id,
      action: 'user_password_reset',
      targetType: 'user',
      targetId: user._id,
      details: { email: user.email },
    });

    res.json({ success: true, tempPassword: newPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── ANALYTICS ──────────────────────────────────────────────────

router.get('/analytics', verifyToken, requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

    // Total queries
    const totalQueriesAgg = await Conversation.aggregate([
      { $unwind: '$messages' },
      { $match: { 'messages.role': 'user' } },
      { $count: 'total' },
    ]);
    const totalQueries = totalQueriesAgg[0]?.total || 0;

    // Monthly active users
    const mauAgg = await Conversation.aggregate([
      { $match: { updatedAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$userId' } },
      { $count: 'total' },
    ]);
    const monthlyActiveUsers = mauAgg[0]?.total || 0;

    // Daily active users
    const dauAgg = await Conversation.aggregate([
      { $match: { updatedAt: { $gte: oneDayAgo } } },
      { $group: { _id: '$userId' } },
      { $count: 'total' },
    ]);
    const dailyActiveUsers = dauAgg[0]?.total || 0;

    // Most asked questions (top 10 user messages)
    const topQuestions = await Conversation.aggregate([
      { $unwind: '$messages' },
      { $match: { 'messages.role': 'user' } },
      { $group: { _id: '$messages.content', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { question: '$_id', count: 1, _id: 0 } },
    ]);

    // Most used documents (top 10 from sources)
    const topDocuments = await Conversation.aggregate([
      { $unwind: '$messages' },
      { $match: { 'messages.role': 'assistant' } },
      { $unwind: '$messages.sources' },
      { $group: { _id: '$messages.sources.filename', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { filename: '$_id', count: 1, _id: 0 } },
    ]);

    // Total users
    const totalUsers = await User.countDocuments();
    const totalDocuments = await Document.countDocuments();

    // Feedback metrics
    const feedbackAgg = await Conversation.aggregate([
      { $unwind: '$messages' },
      { $match: { 'messages.feedback': { $in: ['up', 'down'] } } },
      {
        $group: {
          _id: '$messages.feedback',
          count: { $sum: 1 }
        }
      }
    ]);
    const upvotes = feedbackAgg.find(f => f._id === 'up')?.count || 0;
    const downvotes = feedbackAgg.find(f => f._id === 'down')?.count || 0;

    // Queries over time (Last 7 days)
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const queriesOverTimeAgg = await Conversation.aggregate([
      { $unwind: '$messages' },
      { $match: { 'messages.role': 'user', 'messages.createdAt': { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$messages.createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Ensure all 7 days have a data point even if 0
    const queriesOverTime = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      const found = queriesOverTimeAgg.find(item => item._id === dateStr);
      // Format as "Mon 12" for prettier X axis
      const displayDate = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      queriesOverTime.push({ date: displayDate, count: found ? found.count : 0 });
    }

    res.json({
      totalQueries,
      monthlyActiveUsers,
      dailyActiveUsers,
      totalUsers,
      totalDocuments,
      upvotes,
      downvotes,
      topQuestions,
      topDocuments,
      queriesOverTime,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── CHAT MONITORING ────────────────────────────────────────────

router.get('/conversations', verifyToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.hallucination === 'true') {
      filter['messages.isHallucination'] = true;
    }

    const conversations = await Conversation.find(filter)
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Conversation.countDocuments(filter);

    const enriched = conversations.map((c) => ({
      _id: c._id,
      user: c.userId,
      title: c.title,
      messageCount: c.messages?.length || 0,
      hasHallucination: c.messages?.some((m) => m.isHallucination) || false,
      updatedAt: c.updatedAt,
      createdAt: c.createdAt,
    }));

    res.json({ conversations: enriched, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/conversations/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('userId', 'name email');
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/feedback', verifyToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const feedbackType = req.query.type; // 'up' or 'down'

    const matchStage = {};
    if (feedbackType) {
      matchStage['messages.feedback'] = feedbackType;
    } else {
      matchStage['messages.feedback'] = { $in: ['up', 'down'] };
    }

    const feedbacks = await Conversation.aggregate([
      { $unwind: { path: '$messages', includeArrayIndex: 'messageIndex' } },
      { $match: matchStage },
      { $sort: { 'messages.createdAt': -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: '$messages._id',
          conversationId: '$_id',
          user: { name: '$user.name', email: '$user.email' },
          role: '$messages.role',
          content: '$messages.content',
          feedback: '$messages.feedback',
          createdAt: '$messages.createdAt'
        }
      }
    ]);

    const countAgg = await Conversation.aggregate([
      { $unwind: '$messages' },
      { $match: matchStage },
      { $count: 'total' }
    ]);
    const total = countAgg[0]?.total || 0;

    res.json({ feedbacks, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── AUDIT LOGS ─────────────────────────────────────────────────

router.get('/audit-logs', verifyToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.action) filter.action = req.query.action;
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }

    const logs = await AuditLog.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments(filter);

    res.json({ logs, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── SYSTEM HEALTH ──────────────────────────────────────────────

router.get('/system-health', verifyToken, requireAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const dbStats = await db.stats();

    const vectorCount = await Chunk.countDocuments();
    const documentCount = await Document.countDocuments();
    const userCount = await User.countDocuments();

    // AI token usage (aggregate from conversations)
    const tokenAgg = await Conversation.aggregate([
      { $unwind: '$messages' },
      { $match: { 'messages.role': 'assistant', 'messages.tokenCount': { $gt: 0 } } },
      {
        $group: {
          _id: null,
          totalTokens: { $sum: '$messages.tokenCount' },
          avgResponseTime: { $avg: '$messages.responseTimeMs' },
          totalResponses: { $sum: 1 },
          hallucinationCount: {
            $sum: { $cond: ['$messages.isHallucination', 1, 0] },
          },
        },
      },
    ]);

    const aiUsage = tokenAgg[0] || {
      totalTokens: 0,
      avgResponseTime: 0,
      totalResponses: 0,
      hallucinationCount: 0,
    };

    // Uptime
    const uptimeSeconds = process.uptime();

    res.json({
      mongodb: {
        vectorCount,
        documentCount,
        userCount,
        databaseSize: dbStats.dataSize,
        storageSize: dbStats.storageSize,
        collections: dbStats.collections,
      },
      ai: {
        totalTokens: aiUsage.totalTokens,
        avgResponseTimeMs: Math.round(aiUsage.avgResponseTime || 0),
        totalResponses: aiUsage.totalResponses,
        hallucinationCount: aiUsage.hallucinationCount,
      },
      api: {
        status: 'healthy',
        uptimeSeconds: Math.round(uptimeSeconds),
        uptimeFormatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m`,
      },
      server: {
        memory: process.memoryUsage(),
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
