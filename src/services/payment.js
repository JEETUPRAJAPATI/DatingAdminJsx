import api from '../lib/axios';

const BASE_URL = '/api/admin/payments';

export const getAllPayments = async (page = 1, perPage = 10) => {
    try {
        const response = await api.get(`${BASE_URL}?page=${page}&per_page=${perPage}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
};

export const updatePayment = async (id, data) => {
    try {
        const response = await api.put(`${BASE_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update payment');
    }
};

export const deletePayment = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete payment');
    }
};