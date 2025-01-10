import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.user_type)) {
        // Redirect to appropriate dashboard based on user role
        switch (user.user_type) {
            case 'student':
                return <Navigate to="/dashboard" />;
            case 'mentor':
                return <Navigate to="/mentor/dashboard" />;
            case 'teacher':
                return <Navigate to="/teacher/dashboard" />;
            case 'admin':
                return <Navigate to="/admin/dashboard" />;
            default:
                return <Navigate to="/dashboard" />;
        }
    }

    return children;
};

export default RoleRoute; 