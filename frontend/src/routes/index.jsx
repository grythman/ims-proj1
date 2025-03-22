import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentDashboardLayout from '../layouts/StudentDashboardLayout';
import TeacherLayout from '../layouts/TeacherLayout';
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import TeacherDashboard from '../pages/dashboard/TeacherDashboard';
import Reports from '../pages/reports/Reports';
import ReportDetails from '../pages/reports/ReportDetails';
import SubmitReport from '../pages/reports/SubmitReport';
import ReviewReportsPage from '../pages/reports/ReviewReportsPage';
import ReportView from '../pages/reports/ReportView';
import ReportAnalytics from '../pages/reports/ReportAnalytics';
import MainLayout from '../layouts/MainLayout';
import WebhooksPage from '../pages/WebhooksPage';
import ApplyInternship from '../pages/internships/ApplyInternship';
import InternshipListings from '../pages/student/InternshipListings';
import StudentTasks from '../pages/tasks/StudentTasks';
import StudentSchedule from '../pages/student/Schedule';
import StudentApplications from '../pages/applications/StudentApplications';
import MentorEvaluation from '../pages/student/evaluations/MentorEvaluation';
import TeacherEvaluation from '../pages/student/evaluations/TeacherEvaluation';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Student Routes */}
        <Route path="/student/*" element={<StudentDashboardLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportDetails />} />
          <Route path="reports/view/:id" element={<ReportView />} />
          <Route path="reports/submit" element={<SubmitReport />} />
          <Route path="reports/review" element={<ReviewReportsPage />} />
          <Route path="reports/templates" element={<div>Тайлангийн загварууд</div>} />
          <Route path="reports/analytics" element={<ReportAnalytics />} />
          <Route path="internship-listings" element={<InternshipListings />} />
          <Route path="internship-info" element={<div>Дадлагын дэлгэрэнгүй мэдээлэл</div>} />
          <Route path="tasks" element={<StudentTasks />} />
          <Route path="schedule" element={<StudentSchedule />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="apply-internship" element={<ApplyInternship />} />
          <Route path="evaluations/mentor" element={<MentorEvaluation />} />
          <Route path="evaluations/teacher" element={<TeacherEvaluation />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher/*" element={<TeacherLayout />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="students" element={<div>Students Page</div>} />
          <Route path="evaluations" element={<div>Evaluations Page</div>} />
          <Route path="reports" element={<div>Reports Page</div>} />
          <Route path="reports/view/:id" element={<ReportView />} />
          <Route path="reports/analytics" element={<ReportAnalytics />} />
          <Route path="analytics" element={<div>Analytics Page</div>} />
          <Route path="calendar" element={<div>Calendar Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/webhooks" element={<WebhooksPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 