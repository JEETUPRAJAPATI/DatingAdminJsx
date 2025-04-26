import api from '../lib/axios';

const BASE_URL = '/api/location';

export const getCountries = async () => {
    try {
        const response = await api.get(`${BASE_URL}/countries`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch countries');
    }
};

export const getStates = async (country) => {
    try {
        const response = await api.post(`${BASE_URL}/states`, { country });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch states');
    }
};

export const getCities = async (country, state) => {
    try {
        const response = await api.post(`${BASE_URL}/cities`, { country, state });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch cities');
    }
};