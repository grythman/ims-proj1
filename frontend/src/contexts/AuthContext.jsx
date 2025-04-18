import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { login as apiLogin, getMe } from '../services/api';

// Create auth context
export const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token and load user data
        const loadUser = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    setLoading(true);
                    const userData = await getMe();
                    setUser(userData);
                    setToken(storedToken);
                } catch (error) {
                    console.error('Failed to load user:', error);
                    // Clear invalid token
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    setToken(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await apiLogin({ username, password });
            if (response.status === 'success' && response.data?.access_token && response.data?.user) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                setToken(response.data.access_token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext); 