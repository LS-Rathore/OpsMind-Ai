import api from './api.js';

export const CHAT_STREAM_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/chat';

export const getConversations = async () => {
  const response = await api.get('/chat/conversations');
  return response.data;
};

export const getConversation = async (id) => {
  const response = await api.get(`/chat/conversations/${id}`);
  return response.data;
};

export const renameConversation = async (id, title) => {
  const response = await api.put(`/chat/conversations/${id}`, { title });
  return response.data;
};

export const deleteConversation = async (id) => {
  const response = await api.delete(`/chat/conversations/${id}`);
  return response.data;
};

export const submitMessageFeedback = async (conversationId, messageId, feedback) => {
  const response = await api.post(`/chat/conversations/${conversationId}/messages/${messageId}/feedback`, { feedback });
  return response.data;
};
