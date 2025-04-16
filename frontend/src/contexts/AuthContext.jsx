import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../services/api';
import { toast } from 'react-hot-toast';

// Create auth context
export const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check token and load user on mount
    useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const userData = await authApi.getMe();
                setUser(userData);
                setToken(storedToken);
            } catch (error) {
                console.error('Failed to load user:', error);
                setError(error.message || 'Хэрэглэгчийн мэдээлэл ачааллахад алдаа гарлаа');
                
                // Clear invalid auth data
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                setUser(null);
                setToken(null);
                
                toast.error('Таны холболт дууссан байна. Дахин нэвтэрнэ үү.');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await authApi.login(username, password);
            
            if (response && response.token && response.user) {
                setUser(response.user);
                setToken(response.token);
                toast.success(`Тавтай морил, ${response.user.first_name || response.user.username}!`);
                return true;
            }
            
            throw new Error('Нэвтрэх үед алдаа гарлаа');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Нэвтрэхэд алдаа гарлаа');
            toast.error(error.message || 'Нэвтрэхэд алдаа гарлаа');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        toast.success('Системээс гарлаа');
    };

    const refreshUserData = async () => {
        if (!token) return;
        
        try {
            setLoading(true);
            const userData = await authApi.getMe();
            setUser(userData);
        } catch (error) {
            console.error('Error refreshing user data:', error);
            // If refresh fails due to auth error, handle logout
            if (error.message && error.message.includes('нэвтрэх эрх')) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    // Register new user
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await authApi.register(userData);
            toast.success('Бүртгэл амжилттай үүслээ! Одоо нэвтэрч ороорой.');
            return response;
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message || 'Бүртгүүлэхэд алдаа гарлаа');
            toast.error(error.message || 'Бүртгүүлэхэд алдаа гарлаа');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Reset password request
    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);
        
        try {
            await authApi.forgotPassword(email);
            toast.success('Нууц үг шинэчлэх заавар таны имэйл хаяг руу илгээгдлээ');
            return true;
        } catch (error) {
            console.error('Forgot password error:', error);
            setError(error.message || 'Имэйл илгээхэд алдаа гарлаа');
            toast.error(error.message || 'Имэйл илгээхэд алдаа гарлаа');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Reset password with token
    const resetPassword = async (token, password) => {
        setLoading(true);
        setError(null);
        
        try {
            await authApi.resetPassword(token, password);
            toast.success('Нууц үг амжилттай шинэчлэгдлээ! Одоо нэвтэрч ороорой.');
            return true;
        } catch (error) {
            console.error('Reset password error:', error);
            setError(error.message || 'Нууц үг шинэчлэхэд алдаа гарлаа');
            toast.error(error.message || 'Нууц үг шинэчлэхэд алдаа гарлаа');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Auth context value
    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated: !!token && !!user,
        userType: user?.user_type || null,
        login,
        logout,
        refreshUserData,
        register,
        forgotPassword,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext); 