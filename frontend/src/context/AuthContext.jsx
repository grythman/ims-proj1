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
        switch (userType) {
            case 'student':
                return '/dashboard';
            case 'mentor':
                return '/mentor/dashboard';
            case 'teacher':
                return '/teacher/dashboard';
            case 'admin':
                return '/admin/dashboard';
            default:
                return '/dashboard';
        }
    };

    const login = async (username, password) => {
        try {
            const response = await loginApi(username, password);
            
            if (response.data?.access_token) {
                localStorage.setItem('token', response.data.access_token);
                setUser(response.data.user);
                return {
                    data: response.data,
                    redirectPath: handleRoleBasedRedirect(response.data.user.user_type)
                };
            }
            
            throw new Error('Login failed: Invalid response format');
        } catch (error) {
            console.error('Login failed:', error);
            const errorMessage = error.response?.data?.message || 'Login failed';
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