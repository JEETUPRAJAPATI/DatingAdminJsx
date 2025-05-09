import api from '../lib/axios';

const BASE_URL = '/api/admin/users';

export const getAllUsers = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`${BASE_URL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
};

export const getUserById = async (id) => {
    try {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
};
export const createUser = async (formData) => {
    try {
        // No need to process FormData here since we already did it in handleSubmit
        // Just pass the FormData object directly

        const response = await api.post(`${BASE_URL}`, formData, {
            // Important: Set the correct headers for multipart/form-data
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw new Error(error.response?.data?.message || 'Failed to create user');
    }
};


export const updateUser = async (id, data) => {
    try {
        const response = await api.put(`${BASE_URL}/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update user');
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
};

export const updateUserStatus = async (id, status) => {
    try {
        const response = await api.patch(`${BASE_URL}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update user status');
    }
};

export const banUser = async (id, { reason, duration }) => {
    try {
        const response = await api.put(`${BASE_URL}/${id}/ban`, { reason, duration });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to ban user');
    }
};
