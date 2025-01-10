import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000, // 10 second timeout
});

// Auth related API calls
export const login = async (username, password) => {
    try {
        const response = await api.post('/api/users/login/', {
            username,
            password
        });
        
        if (response.data?.data?.access_token) {
            localStorage.setItem('token', response.data.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        
        return response.data;
    } catch (error) {
        console.error('Login API error:', error.response?.data || error.message);
        throw error;
    }
};

export const getMe = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await api.get('/api/users/me/');
        return response.data;
    } catch (error) {
        console.error('GetMe API error:', error.response?.data || error.message);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/api/users/register/', userData);
        return response.data;
    } catch (error) {
        console.error('Register API error:', error.response?.data || error.message);
        throw error;
    }
};

// Password reset functions
export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/api/users/password-reset/', { email });
        return response.data;
    } catch (error) {
        console.error('Password reset error:', error.response?.data || error.message);
        throw error;
    }
};

export const resetPassword = async (token, password) => {
    try {
        const response = await api.post('/api/users/password-reset/confirm/', {
            token,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Password reset confirm error:', error.response?.data || error.message);
        throw error;
    }
};

// Request interceptor for adding auth token and handling requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for handling common responses and errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        } else if (!error.response && error.message === 'Network Error') {
            // Handle network errors
            console.error('Network error - please check your connection');
        } else {
            // Log other errors
            console.error('API Error:', error.response?.data || error.message);
        }
        return Promise.reject(error);
    }
);

export default api;