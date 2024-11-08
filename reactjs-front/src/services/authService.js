import api from './apiConfig'

export const register = async (data) => {
    return await api.post('/api/auth/register', data);
};

export const logIn = async (data) => {
    return await api.post('/api/auth/log-in', data);
};

export const logOut = async () => {
    return await api.post('/api/auth/log-out');
};

export const verifyToken = async () => {
    return await api.get('/api/auth/verify-token');
};