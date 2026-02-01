import api from './api';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/user/login', { email, password });
            const { token, role } = response.data;

            // Fetch user details immediately to populate the user object fully if needed,
            // or confirm if backend sends full user object. 
            // The controller sends: { success: true, message: "...", token, role }
            // To be consistent with the context expectations, we might want to return { user: { role, ... }, token }
            // But let's stick to returning exactly what the context expects or adapt here.

            return {
                token,
                role
            };
        } catch (error) {
            throw error;
        }
    },

    signup: async (fullname, email, mobile, password, role) => {
        // Backend expects: { fullname, email, mobile, password, role }
        try {
            const response = await api.post('/user/signup', {
                fullname,
                email,
                mobile,
                password,
                role
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/user/profile');
            // Backend returns: { success: true, data: userDetails }
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        // No backend logout endpoint
    }
};
