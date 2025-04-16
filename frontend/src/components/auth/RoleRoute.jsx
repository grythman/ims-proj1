import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Хэрэглэгчийн эрхийг шалгадаг компонент
 * Хэрэв хэрэглэгч тохирох эрхтэй байвал дамжуулсан компонентыг харуулах
 * Үгүй бол тохирох чиглүүлэлт хийх
 * 
 * @param {React.ReactNode} children - Дэд компонент
 * @param {string[]} allowedRoles - Зөвшөөрөгдсөн эрхүүд
 */
const RoleRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Лог хэсэг
    console.log("======= ROLE ROUTE CHECK =======");
    console.log("Current path:", location.pathname);
    console.log("Allowed roles:", allowedRoles);
    console.log("User info:", user);
    
    if (loading) {
        console.log("Auth loading...");
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>;
    }

    if (!user) {
        console.log("No user, redirecting to login");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Get user's role from either user.role or user.user_type
    const userRole = user.role || user.user_type;
    console.log('User role check:', userRole, 'Allowed roles:', allowedRoles);
    
    // Хэрэглэгчийн эрх шалгах
    const hasAccess = allowedRoles.includes(userRole);
    console.log("Access granted:", hasAccess);

    if (!hasAccess) {
        console.log('Access denied. User role not allowed.');
        // Redirect to appropriate dashboard based on user role
        const redirectMap = {
            student: '/student',
            mentor: '/mentor',
            teacher: '/teacher',
            admin: '/admin'
        };
        
        const redirectPath = redirectMap[userRole] || '/login';
        console.log("Redirecting to:", redirectPath);
        
        return <Navigate to={redirectPath} replace />;
    }

    console.log("Access granted, rendering children");
    return children;
};

export default RoleRoute; 