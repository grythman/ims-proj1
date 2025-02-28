import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // If user is already authenticated, redirect to their dashboard
  if (user) {
    const redirectMap = {
      student: '/student/dashboard',
      mentor: '/mentor/dashboard',
      teacher: '/teacher/dashboard',
      admin: '/admin/dashboard'
    };
    return <Navigate to={redirectMap[user.user_type] || '/'} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Internship Management System
        </h2>
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout; 