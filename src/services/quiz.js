import api from '../lib/axios';

const BASE_URL = '/api/admin/quiz';

// Questions API
export const getAllQuestions = async () => {
    try {
        const response = await api.get(`${BASE_URL}/questions`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch questions');
    }
};

export const getQuestionById = async (id) => {
    try {
        const response = await api.get(`${BASE_URL}/questions/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch question details');
    }
};

export const createQuestion = async (data) => {
    try {
        const response = await api.post(`${BASE_URL}/questions`, data);
        return response.data;
    } catch (error) {
        let errorMessage = 'Failed to create question';
        if (error.response?.data?.errors?.length > 0) {
            errorMessage = error.response.data.errors[0].message;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
    }
};

export const updateQuestion = async (id, data) => {
    try {
        const response = await api.put(`${BASE_URL}/questions/${id}`, data);
        return response.data;
    } catch (error) {
        let errorMessage = 'Failed to update question';
        if (error.response?.data?.errors?.length > 0) {
            errorMessage = error.response.data.errors[0].message;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        throw new Error(errorMessage);
    }
};

export const deleteQuestion = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/questions/${id}`);
        return response.data;
    } catch (error) {
        let errorMessage = 'Failed to delete question';
        if (error.response?.data?.errors?.length > 0) {
            errorMessage = error.response.data.errors[0].message;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
    }
};

// Categories API
export const getAllCategories = async () => {
    try {
        const response = await api.get(`${BASE_URL}/categories`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
};

export const createCategory = async (data) => {
    try {
        const response = await api.post(`${BASE_URL}/categories`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create category');
    }
};

export const updateCategory = async (id, data) => {
    try {
        const response = await api.put(`${BASE_URL}/categories/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update category');
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/categories/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
};

// Dashboard API
export const getQuizDashboard = async () => {
    try {
        const response = await api.get(`${BASE_URL}/dashboard`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch quiz dashboard data');
    }
};