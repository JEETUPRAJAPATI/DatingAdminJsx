import api from '../lib/axios';

const BASE_URL = '/api/admin/notifications';

export const getAllNotifications = async () => {
    try {
        const response = await api.get(BASE_URL);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
};

export const deleteNotification = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete notification');
    }
};

export const markAsRead = async (id) => {
    try {
        const response = await api.put(`${BASE_URL}/${id}/read`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
};

export const clearAllNotifications = async () => {
    try {
        const response = await api.delete(`${BASE_URL}/clear`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to clear notifications');
    }
};