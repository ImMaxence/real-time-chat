import api from './apiConfig'

export const getAllUsers = async () => {
    return await api.get('/api/user/get-all');
};

export const getUserById = async (userId) => {
    return await api.get(`/api/user/${userId}/get-by-id`);
};

export const updateUser = async (userId, data) => {
    return await api.put(`/api/user/${userId}/update`, data);
};

export const deleteUser = async (userId) => {
    return await api.delete(`/api/user/${userId}/delete`);
};