import api from './apiConfig'

export const getAllMessages = async () => {
    return await api.get('/api/message/get-all');
};

export const createMessage = async (data) => {
    return await api.post('/api/message/create', data);
};

export const editMessage = async (data) => {
    return await api.put('/api/message/update', data);
};

export const deleteMessage = async (data) => {
    return await api.delete('/api/message/delete', data);
};