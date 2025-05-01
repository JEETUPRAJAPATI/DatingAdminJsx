import api from '../lib/axios';

const BASE_URL = '/api/admin/support';

// Get all support tickets
export const getAllTickets = async (filters = {}) => {
    try {
        const response = await api.get(`${BASE_URL}/tickets`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch support tickets');
    }
};

// Get a single ticket by ID
export const getTicketById = async (ticketId) => {
    try {
        const response = await api.get(`${BASE_URL}/tickets/${ticketId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch ticket details');
    }
};
// supportService.js or support.js

export const updateTicketStatus = async (ticketId, status) => {
    try {
        const response = await api.put(`${BASE_URL}/tickets/${ticketId}/status`, { status });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update ticket status');
    }
};

// Close a support ticket
export const closeTicket = async (ticketId) => {
    try {
        const response = await api.patch(`${BASE_URL}/tickets/${ticketId}/close`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to close ticket');
    }
};

// Assign a ticket to an agent
export const assignTicket = async (ticketId, agentId) => {
    try {
        const response = await api.post(`${BASE_URL}/tickets/${ticketId}/assign`, { agent_id: agentId });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to assign ticket to agent');
    }
};

export const replyTicket = async (ticketId, message, sender, adminId) => {
    try {
        const response = await api.post(`${BASE_URL}/tickets/${ticketId}/reply`, {
            sender,
            message,
            adminId
        });
        return response.data;
    } catch (error) {
        console.error('Reply Ticket Error:', error.response?.data || error.message); // log backend error
        throw new Error(error.response?.data?.message || 'Failed to reply to ticket');
    }
};