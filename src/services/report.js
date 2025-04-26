import api from '../lib/axios';

const BASE_URL = '/api/admin/reports';

export const getAllReports = async (page = 1, perPage = 10) => {
    try {
        const response = await api.get(`${BASE_URL}?page=${page}&per_page=${perPage}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch reports');
    }
};

export const updateReportStatus = async (id, status) => {
    try {
        const response = await api.put(`${BASE_URL}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update report status');
    }
};

export const deleteReport = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete report');
    }
};