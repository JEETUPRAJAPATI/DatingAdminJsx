import api from '../lib/axios';
import Cookies from 'js-cookie';

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/admin/auth/login', credentials);
    console.log('Login response:', response);

    if (response.data.data?.token) {
      // Set token with 7 days expiry
      Cookies.set('adminToken', response.data.data.token, { expires: 7 });
    } else {
      throw new Error('Login failed: No token received');
    }

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password');
    } else if (error.response?.status === 429) {
      throw new Error('Too many login attempts. Please try again later.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }

    throw new Error(error.response?.data?.message || 'An unknown error occurred during login');
  }
};

export const logout = () => {
  Cookies.remove('adminToken');
};