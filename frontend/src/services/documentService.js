import api from './api.js';

export const uploadDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });
  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get('/documents');
  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
};

export const getDocumentByFilename = async (filename) => {
  const documents = await getDocuments();
  return documents.find(
    (doc) => doc.originalName === filename || doc.filename === filename
  );
};

export const getDocumentViewUrl = (documentId) => {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('opsmind_token');
  return `${baseURL}/documents/${documentId}/view?token=${token}`;
};
