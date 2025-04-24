import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: 'https://datingadminapi.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error('Request failed. Please try again.');
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      Cookies.remove('adminToken');
      toast.error('Session expired. Please login again.');
    } else if (error.response.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response.status === 404) {
      toast.error('Resource not found.');
    } else if (error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;