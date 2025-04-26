import api from '../lib/axios';
import { API_ENDPOINTS } from '../constants/api';

export const getAllInterests = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.INTERESTS);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch interests');
    }
};

export const getInterestById = async (id) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.INTERESTS}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch interest');
    }
};

export const createInterest = async (data) => {
    try {
        const response = await api.post(API_ENDPOINTS.INTERESTS, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create interest');
    }
};

export const updateInterest = async (id, data) => {
    try {
        const response = await api.put(`${API_ENDPOINTS.INTERESTS}/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update interest');
    }
};

export const deleteInterest = async (id) => {
    try {
        const response = await api.delete(`${API_ENDPOINTS.INTERESTS}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete interest');
    }
};