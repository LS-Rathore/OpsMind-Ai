import api from './api.js';

// ─── User Management ────────────────────────────────────────────
export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

export const deactivateUser = async (id) => {
  const response = await api.put(`/admin/users/${id}/deactivate`);
  return response.data;
};

export const activateUser = async (id) => {
  const response = await api.put(`/admin/users/${id}/activate`);
  return response.data;
};

export const resetPassword = async (id) => {
  const response = await api.put(`/admin/users/${id}/reset-password`);
  return response.data;
};

// ─── Analytics ──────────────────────────────────────────────────
export const getAnalytics = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};

// ─── Chat Monitoring ────────────────────────────────────────────
export const getAdminConversations = async (params = {}) => {
  const response = await api.get('/admin/conversations', { params });
  return response.data;
};

export const getAdminConversation = async (id) => {
  const response = await api.get(`/admin/conversations/${id}`);
  return response.data;
};

export const getFeedback = async (params = {}) => {
  const response = await api.get('/admin/feedback', { params });
  return response.data;
};

// ─── Audit Logs ─────────────────────────────────────────────────
export const getAuditLogs = async (params = {}) => {
  const response = await api.get('/admin/audit-logs', { params });
  return response.data;
};

// ─── System Health ──────────────────────────────────────────────
export const getSystemHealth = async () => {
  const response = await api.get('/admin/system-health');
  return response.data;
};

// ─── Document Management ────────────────────────────────────────
export const reindexDocument = async (documentId) => {
  const response = await api.post(`/documents/${documentId}/reindex`);
  return response.data;
};
