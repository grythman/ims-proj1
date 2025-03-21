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

// Mock data for development when API is not available
const mockUsers = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        user_type: 'admin'
    },
    {
        id: 2,
        username: 'student',
        password: 'student123',
        first_name: 'Student',
        last_name: 'User',
        email: 'student@example.com',
        user_type: 'student'
    },
    {
        id: 3,
        username: 'mentor',
        password: 'mentor123',
        first_name: 'Mentor',
        last_name: 'User',
        email: 'mentor@example.com',
        user_type: 'mentor'
    },
    {
        id: 4,
        username: 'teacher',
        password: 'teacher123',
        first_name: 'Teacher',
        last_name: 'User',
        email: 'teacher@example.com',
        user_type: 'teacher'
    }
];

// Check if we should use mock data
const useMockApi = process.env.REACT_APP_MOCK_API === 'true';

// Auth related API calls
export const login = async (username, password) => {
    try {
        console.log('Sending login request with data:', { username });
        
        // Use mock data in development when API is not available
        if (useMockApi) {
            console.log('Using mock login data');
            const user = mockUsers.find(u => u.username === username && u.password === password);
            
            if (user) {
                // Simulate API response
                const mockResponse = {
                    status: 'success',
                    data: {
                        access_token: 'mock_jwt_token_' + user.id,
                        user: {
                            ...user,
                            password: undefined // Don't include password in response
                        }
                    }
                };
                
                // Store the token and user data
                localStorage.setItem('token', mockResponse.data.access_token);
                localStorage.setItem('user', JSON.stringify(mockResponse.data.user));
                
                // Log user info for debugging
                console.log('Mock user logged in:', {
                    id: user.id,
                    name: `${user.first_name} ${user.last_name}`,
                    role: user.user_type
                });
                
                // Update axios default headers
                api.defaults.headers.common['Authorization'] = `Bearer ${mockResponse.data.access_token}`;
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                return mockResponse;
            } else {
                throw new Error('Invalid username or password');
            }
        }
        
        // Real API call
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
            // Store the token and user data
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Log user info for debugging
            console.log('User logged in:', {
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
                role: user.user_type
            });
            
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

        // Use mock data in development when API is not available
        if (useMockApi) {
            console.log('Using mock user data');
            const userStorage = localStorage.getItem('user');
            if (userStorage) {
                const user = JSON.parse(userStorage);
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 300));
                
                return user;
            }
            throw new Error('No user found in storage');
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
        
        // Use mock data in development when API is not available
        if (useMockApi) {
            console.log('Using mock registration');
            
            // Check if username already exists
            if (mockUsers.some(u => u.username === userData.username)) {
                throw new Error('Username already exists');
            }
            
            // Create new mock user
            const newUser = {
                id: mockUsers.length + 1,
                username: userData.username,
                password: userData.password,
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                email: userData.email || '',
                user_type: userData.user_type || 'student'
            };
            
            // Add to mock users (would persist in a real backend)
            mockUsers.push(newUser);
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            return {
                status: 'success',
                message: 'Registration successful',
                data: {
                    ...newUser,
                    password: undefined
                }
            };
        }
        
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

// Interceptor to add auth header and handle token refresh
api.interceptors.request.use(
    async (config) => {
        // Try to get user from localStorage
        try {
            const authStorage = localStorage.getItem('auth');
            // Remove the unused user variable if we don't need it
            if (authStorage) {
                const { token } = JSON.parse(authStorage);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.error('Error parsing auth from localStorage:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
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
            // Handle network errors - attempt to use mock if enabled
            console.error('Network error - API server may not be running');
            
            // If in development and mock is not already enabled, suggest enabling mock
            if (process.env.NODE_ENV === 'development' && !useMockApi) {
                console.info('Consider setting REACT_APP_MOCK_API=true in .env for development without a backend');
            }
        } else {
            // Log other errors
            console.error('API Error:', error.response?.data || error.message);
        }
        return Promise.reject(error);
    }
);

export default api;