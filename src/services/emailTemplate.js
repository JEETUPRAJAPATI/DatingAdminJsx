import api from '../lib/axios';

const BASE_URL = '/api/admin/email-templates';

// Get all email templates
export const getAllEmailTemplates = async () => {
    try {
        const response = await api.get(`${BASE_URL}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch email templates');
    }
};

// Get a single email template by ID
export const getEmailTemplateById = async (templateId) => {
    try {
        const response = await api.get(`${BASE_URL}/${templateId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch email template details');
    }
};

// Create a new email template
export const createEmailTemplate = async (data) => {
    try {
        const response = await api.post(BASE_URL, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create email template');
    }
};

// Update an email template by ID
export const updateEmailTemplate = async (templateId, data) => {
    try {
        const response = await api.put(`${BASE_URL}/${templateId}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update email template');
    }
};

// Delete an email template by ID
export const deleteEmailTemplate = async (templateId) => {
    try {
        const response = await api.delete(`${BASE_URL}/${templateId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete email template');
    }
};
