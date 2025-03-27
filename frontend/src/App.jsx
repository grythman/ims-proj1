import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import RoleRoute from './components/auth/RoleRoute'
import { ConfigProvider, App as AntApp, message } from 'antd'
import mnMN from 'antd/lib/locale/mn_MN'
import dayjs from 'dayjs'
import 'dayjs/locale/mn'
import ErrorState from './components/UI/ErrorState'

// Layouts
import AdminDashboardLayout from './layouts/AdminDashboardLayout'
import MentorDashboardLayout from './layouts/MentorDashboardLayout'
import StudentDashboardLayout from './layouts/StudentDashboardLayout'
import TeacherDashboardLayout from './layouts/TeacherDashboardLayout'
import DashboardLayout from './components/Layout/DashboardLayout'
import AuthLayout from './components/Layout/AuthLayout'

// Pages
import HomePage from './pages/Home'
import ForgotPassword from './pages/auth/ForgotPassword'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ResetPassword from './pages/auth/ResetPassword'
import ApplyInternship from './pages/internships/ApplyInternship'
import ApplicationsPage from './pages/applications/ApplicationsPage'
import MentorApplicationsPage from './pages/applications/MentorApplicationsPage'
import NotificationsPage from './pages/settings/NotificationsPage'
import NotificationHistoryPage from './pages/notifications/NotificationHistoryPage'
import NotificationDetailPage from './pages/notifications/NotificationDetailPage'
import SubmitReportPage from './pages/reports/SubmitReportPage'
import ChatPage from './pages/chat/ChatPage'
import EvaluationsPage from './pages/evaluations/EvaluationsPage'
import AnalyticsPage from './pages/analytics/AnalyticsPage'
import ReportTemplatesPage from './pages/reports/ReportTemplatesPage'
import ReviewReportsPage from './pages/reports/ReviewReportsPage'
import Tasks from './pages/tasks/Tasks'
import Unauthorized from './pages/Unauthorized'
import CreateReport from './pages/reports/CreateReport'
import ViewReport from './pages/reports/ViewReport'
import MentorEvaluation from './pages/student/evaluations/MentorEvaluation'
import TeacherEvaluation from './pages/student/evaluations/TeacherEvaluation'
import InternshipListings from './pages/student/InternshipListings'
import InternshipDetails from './pages/student/InternshipDetails'
import SchedulePage from './pages/student/schedule/SchedulePage'

// Dashboards
import AdminDashboard from './pages/dashboard/AdminDashboard'
import MentorDashboard from './pages/dashboard/MentorDashboard'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import TeacherDashboard from './pages/dashboard/TeacherDashboard'

// Configure dayjs locale
dayjs.locale('mn')

// Global message configuration
message.config({
  maxCount: 3,
  duration: 3
})

const NetworkStatusHandler = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isReconnecting, setIsReconnecting] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setIsReconnecting(true)
      // Show reconnected message
      message.success('Сүлжээнд амжилттай холбогдлоо')
      // Reset reconnecting state after a delay
      setTimeout(() => setIsReconnecting(false), 2000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      message.error('Сүлжээний холболт тасарлаа')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOnline) {
    return (
      <ErrorState 
        title="Сүлжээний холболт тасарлаа" 
        subTitle="Таны төхөөрөмж интернет холболтгүй байна. Сүлжээний холболтоо шалгана уу." 
        showReturnButton={false}
        showRetryButton={false}
      />
    )
  }

  return children
}

const App = () => {
  return (
    <ConfigProvider locale={mnMN}>
      <AntApp>
        <AuthProvider>
          <Toaster position="top-right" />
          <NetworkStatusHandler>
            <Routes>
              {/* Public Home Page */}
              <Route path="/home" element={<HomePage />} />

              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              {/* Protected Dashboard Routes */}
              <Route element={<DashboardLayout />}>
                {/* Student Routes */}
                <Route
                  path="/student"
                  element={
                    <RoleRoute allowedRoles={['student']}>
                      <StudentDashboardLayout>
                        <Outlet />
                      </StudentDashboardLayout>
                    </RoleRoute>
                  }
                >
                  <Route index element={<StudentDashboard />} />
                  <Route path="reports/new" element={<SubmitReportPage />} />
                  <Route path="reports/my" element={<ReviewReportsPage />} />
                  <Route path="reports/templates" element={<ReportTemplatesPage />} />
                  <Route path="reports/create" element={<CreateReport />} />
                  <Route path="reports/view/:id" element={<ViewReport />} />
                  <Route path="reports/submit" element={<SubmitReportPage />} />
                  <Route path="apply-internship" element={<ApplyInternship />} />
                  <Route path="applications" element={<ApplicationsPage />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="internship-listings" element={<InternshipListings />} />
                  <Route path="internship-details/:id" element={<InternshipDetails />} />
                  <Route path="evaluations/mentor" element={<MentorEvaluation />} />
                  <Route path="evaluations/teacher" element={<TeacherEvaluation />} />
                  <Route path="schedule" element={<SchedulePage />} />
                </Route>

                {/* Mentor Routes */}
                <Route
                  path="/mentor"
                  element={
                    <RoleRoute allowedRoles={['mentor']}>
                      <MentorDashboardLayout>
                        <Outlet />
                      </MentorDashboardLayout>
                    </RoleRoute>
                  }
                >
                  <Route index element={<MentorDashboard />} />
                  <Route path="reports/submitted" element={<ReviewReportsPage />} />
                  <Route path="reports/templates" element={<ReportTemplatesPage />} />
                  <Route path="reports/view/:id" element={<ViewReport />} />
                  <Route path="evaluations" element={<EvaluationsPage />} />
                  <Route path="chat" element={<ChatPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="applications" element={<MentorApplicationsPage />} />
                </Route>

                {/* Teacher Routes */}
                <Route
                  path="/teacher"
                  element={
                    <RoleRoute allowedRoles={['teacher']}>
                      <TeacherDashboardLayout>
                        <Outlet />
                      </TeacherDashboardLayout>
                    </RoleRoute>
                  }
                >
                  <Route index element={<TeacherDashboard />} />
                  <Route path="reports/review" element={<ReviewReportsPage />} />
                  <Route path="reports/templates" element={<ReportTemplatesPage />} />
                  <Route path="reports/view/:id" element={<ViewReport />} />
                  <Route path="evaluations" element={<EvaluationsPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                </Route>

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <RoleRoute allowedRoles={['admin']}>
                      <AdminDashboardLayout>
                        <Outlet />
                      </AdminDashboardLayout>
                    </RoleRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="reports/review" element={<ReviewReportsPage />} />
                  <Route path="reports/templates" element={<ReportTemplatesPage />} />
                  <Route path="reports/view/:id" element={<ViewReport />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                </Route>

                {/* Common Routes */}
                <Route
                  path="/settings/notifications"
                  element={
                    <RoleRoute allowedRoles={['student', 'mentor', 'teacher', 'admin']}>
                      <NotificationsPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/notifications/history"
                  element={
                    <RoleRoute allowedRoles={['student', 'mentor', 'teacher', 'admin']}>
                      <NotificationHistoryPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/notifications/:id"
                  element={
                    <RoleRoute allowedRoles={['student', 'mentor', 'teacher', 'admin']}>
                      <NotificationDetailPage />
                    </RoleRoute>
                  }
                />
              </Route>

              {/* Default Route */}
              <Route path="/" element={<DefaultRedirect />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NetworkStatusHandler>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  )
}

// Component to handle default route redirection based on user role
const DefaultRedirect = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const redirectMap = {
    student: '/student',
    mentor: '/mentor',
    teacher: '/teacher',
    admin: '/admin'
  }

  // Check for both user.role and user.user_type
  const userRole = user.role || user.user_type;
  console.log('User information:', user);
  console.log('Role for redirection:', userRole);

  return <Navigate to={redirectMap[userRole] || '/login'} replace />
}

export default App