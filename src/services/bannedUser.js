import api from '../lib/axios';

const BASE_URL = '/api/admin/users/banned/list';

export const getBannedUsers = async (page = 1, perPage = 10) => {
    try {
        const response = await api.get(`${BASE_URL}?page=${page}&per_page=${perPage}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch banned users');
    }
};

export const unbanUser = async (userId, reason) => {
    try {
        const response = await api.put(`/api/admin/users/${userId}/unban`, { reason });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to unban user');
    }
};