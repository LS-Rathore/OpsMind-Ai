import api from './api';

export const documentService = {
    uploadDocument: async (file, onProgress) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                if (onProgress) onProgress(percentCompleted);
            },
        });
        return response.data;
    },

    getDocuments: async () => {
        const response = await api.get('/documents');
        return response.data;
    },

    deleteDocument: async (id) => {
        await api.delete(`/documents/${id}`);
    }
};
