import api from '../lib/axios';

const BASE_URL = '/api/admin';

export const getDashboardStats = async () => {
    try {
        const response = await api.get(`${BASE_URL}/dashboard`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
};

export const getRecentActivities = async () => {
    try {
        const response = await api.get(`${BASE_URL}/recent-activities`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch recent activities');
    }
};

export const getUserGrowthChart = async (timeFrame) => {
    try {
        const response = await api.post(`${BASE_URL}/user-growth-chart`, { time_frame: timeFrame });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user growth data');
    }
};

export const getRevenueChart = async (timeFrame) => {
    try {
        const response = await api.post(`${BASE_URL}/revenue-chart`, { time_frame: timeFrame });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch revenue data');
    }
};