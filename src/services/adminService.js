import api from './api';

export const adminService = {
    getAllUsers: async () => {
        try {
            const response = await api.get('/admin/users');
            // Backend returns: { success: true, data: allUsers }
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    uploadPdf: async (pdfTitle, pdfFile) => {
        try {
            const formData = new FormData();
            formData.append('pdftitle', pdfTitle);
            formData.append('pdffile', pdfFile);

            const response = await api.post('/admin/uploadpdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllPdfs: async () => {
        try {
            const response = await api.get('/admin/pdf');
            // Backend returns: { success: true, data: allPdf, length: ... }
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    updatePdf: async (id, pdfTitle, pdfFile) => {
        try {
            const formData = new FormData();
            formData.append('pdftitle', pdfTitle);
            if (pdfFile) {
                formData.append('pdffile', pdfFile);
            }

            const response = await api.put(`/admin/updatepdf/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deletePdf: async (id) => {
        try {
            const response = await api.delete(`/admin/deletepdf/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
