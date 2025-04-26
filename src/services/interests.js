import api from '../lib/axios';

const BASE_URL = '/api/admin';

// Interest Categories API
export const getAllCategories = async () => {
    try {
        const response = await api.get(`${BASE_URL}/interest-categories`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
};

export const getCategoryById = async (id) => {
    try {
        const response = await api.get(`${BASE_URL}/interest-categories/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
};

export const createCategory = async (data) => {
    try {
        const response = await api.post(`${BASE_URL}/interest-categories`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create category');
    }
};

export const updateCategory = async (id, data) => {
    try {
        const response = await api.put(`${BASE_URL}/interest-categories/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update category');
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/interest-categories/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
};

// Interests API
export const getAllInterests = async () => {
    try {
        const response = await api.get(`${BASE_URL}/interests`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch interests');
    }
};

export const getInterestById = async (id) => {
    try {
        const response = await api.get(`${BASE_URL}/interests/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch interest');
    }
};

export const createInterest = async (data) => {
    try {
        const response = await api.post(`${BASE_URL}/interests`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create interest');
    }
};

export const updateInterest = async (id, data) => {
    try {
        const response = await api.put(`${BASE_URL}/interests/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update interest');
    }
};

export const deleteInterest = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/interests/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete interest');
    }
};