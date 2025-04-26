import api from '../lib/axios';

const BASE_URL = '/api/admin/profile';

export const getProfile = async () => {
    try {
        const response = await api.get(BASE_URL);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
};

export const updateProfile = async (data) => {
    try {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        const response = await api.put(`${BASE_URL}/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
};

export const changePassword = async (data) => {
    try {
        const response = await api.put(`${BASE_URL}/change-password`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to change password');
    }
};