import { Router } from 'express';
import Conversation from '../models/Conversation.js';
import { retrieveRelevantChunks } from '../services/retriever.js';
import { streamChatResponse } from '../services/llmService.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { query, conversationId } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const chunks = await retrieveRelevantChunks(query, 5);

    let fullResponse = '';
    let sources = [];
    let metadata = {};

    const originalWrite = res.write.bind(res);
    res.write = (data) => {
      try {
        const jsonStr = data.replace('data: ', '').trim();
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          if (parsed.type === 'token') fullResponse += parsed.content;
          if (parsed.type === 'sources') sources = parsed.sources;
          if (parsed.type === 'metadata') {
            metadata = {
              tokenCount: parsed.tokenCount,
              responseTimeMs: parsed.responseTimeMs,
              isHallucination: parsed.isHallucination,
            };
          }
        }
      } catch { }
      return originalWrite(data);
    };

    await streamChatResponse(query, chunks, res);

    res.write = originalWrite;

    const userMessage = { role: 'user', content: query };
    const assistantMessage = {
      role: 'assistant',
      content: fullResponse,
      sources,
      tokenCount: metadata.tokenCount || 0,
      responseTimeMs: metadata.responseTimeMs || 0,
      isHallucination: metadata.isHallucination || false,
    };

    if (conversationId) {
      await Conversation.findByIdAndUpdate(conversationId, {
        $push: { messages: { $each: [userMessage, assistantMessage] } },
      });
    } else {
      const conversation = await Conversation.create({
        userId: req.user.id,
        title: query.slice(0, 50),
        messages: [userMessage, assistantMessage],
      });
      res.write(`data: ${JSON.stringify({ type: 'conversationId', id: conversation._id })}\n\n`);
    }

    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
});

router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .select('_id title createdAt updatedAt');
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/conversations/:id', verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    if (conversation.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/conversations/:id', verifyToken, async (req, res) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    if (conversation.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    conversation.title = title;
    await conversation.save();
    res.json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/conversations/:id', verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    if (conversation.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/conversations/:id/messages/:messageId/feedback', verifyToken, async (req, res) => {
  try {
    const { feedback } = req.body;
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    if (conversation.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const message = conversation.messages.id(req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.feedback = feedback;
    await conversation.save();

    res.json({ success: true, feedback: message.feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;