import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PrivateRoute = ({ children, requiredRole = null }) => {
    const { user, loading, isAuthenticated, userType } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
        // Redirect to login but save the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If a specific role is required, check for it
    if (requiredRole && userType !== requiredRole && userType !== 'admin') {
        // If user doesn't have the required role, redirect to unauthorized page
        return <Navigate to="/unauthorized" replace />;
    }

    // User is authenticated and has required role (if any)
    return children;
};

export default PrivateRoute; 