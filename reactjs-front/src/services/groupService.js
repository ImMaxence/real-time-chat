import api from './apiConfig'

export const createGroup = async (data) => {
    return await api.post('/api/group/create', data);
};

export const getGroupMessages = async (groupId) => {
    return await api.get(`/api/group/${groupId}/messages`);
};

export const addMemberToGroup = async (groupId, data) => {
    return await api.post(`/api/group/${groupId}/add-member`, data);
};

export const removeMemberFromGroup = async (groupId, data) => {
    return await api.post(`/api/group/${groupId}/remove-member`, data);
};

export const getAllGroups = async () => {
    return await api.get('/api/group/get-all');
};

export const updateGroup = async (groupId, data) => {
    return await api.put(`/api/group/${groupId}/update`, data);
};

export const deleteGroup = async (groupId) => {
    return await api.delete(`/api/group/${groupId}/delete`);
};

export const getGroupUsers = async (groupId) => {
    return await api.get(`/api/group/${groupId}/users`)
}