import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, getMe } from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Checking auth with token:', token ? 'Token exists' : 'No token');
            
            if (token) {
                const userData = await getMe();
                console.log('User data from getMe:', userData);
                setUser(userData);
                
                if (userData.user_type) {
                    console.log('User type detected:', userData.user_type);
                } else {
                    console.warn('No user type found in userData');
                }
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const handleRedirect = (userType) => {
        const redirectMap = {
            'student': '/student/dashboard',
            'mentor': '/mentor/dashboard',
            'teacher': '/teacher/dashboard',
            'admin': '/admin/dashboard'
        };

        const redirectPath = redirectMap[userType] || '/';
        console.log('Redirecting to:', redirectPath);
        navigate(redirectPath);
    };

    const login = async (username, password) => {
        try {
            console.log('Attempting login with:', { username });
            
            if (process.env.REACT_APP_MOCK_API === 'true') {
                console.log('MOCK_API is enabled in environment');
            }
            
            const response = await apiLogin(username, password);
            console.log('Login response:', response);
            
            if (response && response.token) {
                localStorage.setItem('token', response.token);
                
                if (response.user) {
                    setUser(response.user);
                    toast.success('Амжилттай нэвтэрлээ!');
                    handleRedirect(response.user.user_type);
                    return response.user;
                }
            } else if (response && response.detail) {
                throw new Error(response.detail);
            } else {
                throw new Error('Нэвтрэх үйлдэл амжилтгүй боллоо');
            }
        } catch (error) {
            console.error('Login failed:', error);
            
            // Дэлгэрэнгүй алдааны мэдээлэл
            let errorMessage = 'Нэвтрэх үйлдэл амжилтгүй боллоо. Хэрэглэгчийн нэр эсвэл нууц үг буруу байна.';
            
            if (error.response) {
                console.error('Error response:', error.response.status, error.response.data);
                
                // HTTP 401 Unauthorized алдаа
                if (error.response.status === 401) {
                    errorMessage = 'Хэрэглэгчийн нэр эсвэл нууц үг буруу байна';
                } 
                // HTTP 400 Bad Request алдаа
                else if (error.response.status === 400) {
                    errorMessage = 'Буруу форматтай хүсэлт илгээгдлээ. Талбаруудаа шалгана уу.';
                }
            }
            
            toast.error(errorMessage);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Системээс гарлаа!');
        navigate('/login');
    };

    const contextValue = {
        user,
        loading,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);