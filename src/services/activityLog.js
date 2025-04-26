import api from '../lib/axios';

const BASE_URL = '/api/admin/activity-logs';

export const getActivityLogs = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams({
            page: params.page || 1,
            per_page: params.perPage || 10,
            ...(params.userId && { user_id: params.userId }),
            ...(params.action && { action: params.action }),
            ...(params.dateFrom && { date_from: params.dateFrom }),
            ...(params.dateTo && { date_to: params.dateTo })
        }).toString();

        const response = await api.get(`${BASE_URL}?${queryParams}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch activity logs');
    }
};

export const deleteLog = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete log');
    }
};

export const clearAllLogs = async () => {
    try {
        const response = await api.delete(`${BASE_URL}/all`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to clear all logs');
    }
};