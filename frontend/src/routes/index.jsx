import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Protected pages
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import ReportsPage from '../pages/ReportsPage';
import InternshipsPage from '../pages/InternshipsPage';
import InternshipDetailsPage from '../pages/InternshipDetailsPage';
import EvaluationsPage from '../pages/EvaluationsPage';
import NotificationsPage from '../pages/NotificationsPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';

// User type specific pages
import MentorDashboardPage from '../pages/mentor/DashboardPage';
import TeacherDashboardPage from '../pages/teacher/DashboardPage';
import StudentDashboardPage from '../pages/student/DashboardPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes - available to unauthenticated users */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected routes - require authentication */}
      <Route element={<MainLayout />}>
        {/* Common routes for all users */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        
        <Route path="/reports" element={
          <PrivateRoute>
            <ReportsPage />
          </PrivateRoute>
        } />
        
        <Route path="/internships" element={
          <PrivateRoute>
            <InternshipsPage />
          </PrivateRoute>
        } />
        
        <Route path="/internships/:id" element={
          <PrivateRoute>
            <InternshipDetailsPage />
          </PrivateRoute>
        } />
        
        <Route path="/evaluations" element={
          <PrivateRoute>
            <EvaluationsPage />
          </PrivateRoute>
        } />
        
        <Route path="/notifications" element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        } />
        
        {/* Role-specific routes */}
        <Route path="/mentor/dashboard" element={
          <PrivateRoute requiredRole="mentor">
            <MentorDashboardPage />
          </PrivateRoute>
        } />
        
        <Route path="/teacher/dashboard" element={
          <PrivateRoute requiredRole="teacher">
            <TeacherDashboardPage />
          </PrivateRoute>
        } />
        
        <Route path="/student/dashboard" element={
          <PrivateRoute requiredRole="student">
            <StudentDashboardPage />
          </PrivateRoute>
        } />
        
        {/* Special pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 