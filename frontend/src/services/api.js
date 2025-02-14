import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true,
    timeout: 10000, // 10 second timeout
});

// Auth related API calls
export const login = async (username, password) => {
    try {
        console.log('Sending login request with data:', { username });
        const response = await api.post('/api/users/login/', 
            { username, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
        
        console.log('Login API response:', {
            status: response.status,
            data: response.data
        });
        
        if (response.data?.status === 'success') {
            const { access_token, user } = response.data.data;
            // Store the token
            localStorage.setItem('token', access_token);
            // Update axios default headers
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            return response.data;
        }
        
        throw new Error('Invalid response format from server');
    } catch (error) {
        console.error('Login API error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            stack: error.stack
        });
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
        console.log('Sending registration request with data:', userData);
        const response = await api.post('/api/users/register/', userData);
        console.log('Registration API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Registration API error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
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
        // Ensure headers are properly set for each request
        config.headers = {
            ...config.headers,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log('Request config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        
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