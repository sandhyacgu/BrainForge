import api from './api';

const authService = {

    register: async (username, email, password) => {
        const response = await api.post('/api/auth/register', {
            username,
            email,
            password
        });
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/api/auth/login', {
            email,
            password
        });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    saveAuth: (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            username: data.username,
            email: data.email,
            role: data.role
        }));
    },

    getToken: () => localStorage.getItem('token'),

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isLoggedIn: () => !!localStorage.getItem('token')
};

export default authService;