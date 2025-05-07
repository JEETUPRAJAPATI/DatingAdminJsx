import api from '../lib/axios';

const BASE_URL = '/api/admin/admins';

export const getAllAdmins = async () => {
    try {
        const response = await api.get(BASE_URL);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch admins');
    }
};

export const getAdminById = async (id) => {
    try {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch admin details');
    }
};

export const createAdmin = async (data) => {
    try {
        const response = await api.post(BASE_URL, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create admin' };
    }
};

export const updateAdmin = async (id, data) => {
    try {
        const response = await api.put(`${BASE_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update admin' };
    }
};

export const deleteAdmin = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete admin');
    }
};

export const updateAdminStatus = async (id, status) => {
    try {
        const response = await api.patch(`${BASE_URL}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update admin status');
    }
};

export const assignRoleAndPermissions = async (id, data) => {
    try {
        const response = await api.patch(`${BASE_URL}/${id}/assign-role`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to assign role and permissions');
    }
};
export const forgotPassword = async (data) => {
    try {
        const response = await api.post(`/api/admin/forgot-password`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to assign role and permissions');
    }
};

export const resetPassword = async ({ email, token, password, confirmPassword }) => {
    const response = await api.post('/api/admin/reset-password', {
        email,
        token,
        password,
        confirmPassword
    });
    return response.data;
};