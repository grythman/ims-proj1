import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import RoleRoute from './components/Auth/RoleRoute'

// Layouts
import AdminDashboardLayout from './layouts/AdminDashboardLayout'
import MentorDashboardLayout from './layouts/MentorDashboardLayout'
import StudentDashboardLayout from './layouts/StudentDashboardLayout'
import TeacherDashboardLayout from './layouts/TeacherDashboardLayout'

// Pages
import HomePage from './pages/Home'
import ForgotPassword from './pages/auth/ForgotPassword'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ResetPassword from './pages/auth/ResetPassword'

// Dashboards
import AdminDashboard from './pages/dashboard/AdminDashboard'
import MentorDashboard from './pages/dashboard/MentorDashboard'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import TeacherDashboard from './pages/dashboard/TeacherDashboard'

// Auth & Protection
import { useAuth } from './context/AuthContext'

const App = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  // Function to get the default route based on user role
  const getDefaultRoute = () => {
    if (!user) return '/login'
    
    switch (user?.user_type) {
      case 'student':
        return '/dashboard'
      case 'mentor':
        return '/mentor/dashboard'
      case 'teacher':
        return '/teacher/dashboard'
      case 'admin':
        return '/admin/dashboard'
      default:
        return '/login'
    }
  }

  // Define routes array with proper type checking
  const routes = [
    // Public Routes
    { path: '/', element: <HomePage /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/reset-password', element: <ResetPassword /> },

    // Protected Routes
    {
      path: '/dashboard/*',
      element: (
        <RoleRoute allowedRoles={['student']}>
          <StudentDashboardLayout>
            <StudentDashboard />
          </StudentDashboardLayout>
        </RoleRoute>
      )
    },
    {
      path: '/mentor/dashboard/*',
      element: (
        <RoleRoute allowedRoles={['mentor']}>
          <MentorDashboardLayout>
            <MentorDashboard />
          </MentorDashboardLayout>
        </RoleRoute>
      )
    },
    {
      path: '/teacher/dashboard/*',
      element: (
        <RoleRoute allowedRoles={['teacher']}>
          <TeacherDashboardLayout>
            <TeacherDashboard />
          </TeacherDashboardLayout>
        </RoleRoute>
      )
    },
    {
      path: '/admin/dashboard/*',
      element: (
        <RoleRoute allowedRoles={['admin']}>
          <AdminDashboardLayout>
            <AdminDashboard />
          </AdminDashboardLayout>
        </RoleRoute>
      )
    },
    // Catch all route
    { path: '*', element: <Navigate to={getDefaultRoute()} replace /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Routes>
        {Array.isArray(routes) && routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  )
}

export default App