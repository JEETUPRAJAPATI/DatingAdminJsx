import api from '../lib/axios';
import { API_ENDPOINTS } from '../constants/api';

export const getAllSubscriptions = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.SUBSCRIPTIONS);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch subscriptions');
    }
};

export const getSubscriptionById = async (id) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.SUBSCRIPTIONS}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch subscription');
    }
};

export const createSubscription = async (data) => {
    try {
        const response = await api.post(API_ENDPOINTS.SUBSCRIPTIONS, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create subscription');
    }
};

export const updateSubscription = async (id, data) => {
    try {
        const response = await api.put(`${API_ENDPOINTS.SUBSCRIPTIONS}/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update subscription');
    }
};

export const updateSubscriptionStatus = async (id, status) => {
    try {
        const response = await api.patch(`${API_ENDPOINTS.SUBSCRIPTIONS}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update subscription status');
    }
};