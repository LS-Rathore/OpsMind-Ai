import api from './api';

export const authService = {
    login: async (email, password) => {
        // Mock Login for Demo
        if (email === 'admin@opsmind.ai' && password === 'admin') {
            return {
                user: {
                    id: '1',
                    name: 'Admin User',
                    email: 'admin@opsmind.ai',
                    role: 'admin'
                },
                token: 'mock-jwt-token'
            };
        }
        // Mock User Login
        if (email === 'user@opsmind.ai' && password === 'user') {
            return {
                user: {
                    id: '2',
                    name: 'Demo User',
                    email: 'user@opsmind.ai',
                    role: 'user'
                },
                token: 'mock-jwt-token-user'
            };
        }

        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            // If backend is down, throw specific error unless using mock
            throw error;
        }
    },

    signup: async (name, email, password) => {
        // Mock Signup
        return {
            user: {
                id: Date.now().toString(),
                name: name,
                email: email,
                role: 'user'
            },
            token: 'mock-jwt-token-signup'
        };
        // Real implementation:
        // const response = await api.post('/auth/signup', { name, email, password });
        // return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    logout: async () => {
        // Optional: Call backend to invalidate token if needed
        // await api.post('/auth/logout');
    }
};
