import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, getMe } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const userData = await getMe();
                setUser(userData);
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    };

    const handleRoleBasedRedirect = (userType) => {
        console.log('Handling redirect for user type:', userType);
        switch (userType) {
            case 'student':
                return '/student/dashboard';
            case 'mentor':
                return '/mentor/dashboard';
            case 'teacher':
                return '/teacher/dashboard';
            case 'admin':
                return '/admin/dashboard';
            default:
                console.warn('Unknown user type:', userType);
                return '/';
        }
    };

    const login = async (username, password) => {
        try {
            console.log('Attempting login with:', { username });
            const response = await loginApi(username, password);
            console.log('Login response:', response);
            
            // Check if the response has the expected structure
            if (response?.status === 'success' && response?.data?.access_token) {
                localStorage.setItem('token', response.data.access_token);
                setUser(response.data.user);
                const redirectPath = handleRoleBasedRedirect(response.data.user.user_type);
                console.log('Login successful, redirecting to:', redirectPath);
                return {
                    data: response.data,
                    redirectPath
                };
            }
            
            console.error('Invalid response format:', response);
            throw new Error(response?.message || 'Login failed: Invalid response format');
        } catch (error) {
            console.error('Login error details:', {
                response: error.response?.data,
                status: error.response?.status,
                message: error.message
            });
            
            // Extract error message with fallbacks
            const errorMessage = 
                error.response?.data?.errors?.error?.[0] || 
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Invalid username or password';
                
            toast.error(errorMessage);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        return '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);