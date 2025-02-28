import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentDashboardLayout from '../layouts/StudentDashboardLayout';
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import Reports from '../pages/reports/Reports';
import ReportDetails from '../pages/reports/ReportDetails';
import SubmitReport from '../pages/reports/SubmitReport';
import ReviewReportsPage from '../pages/reports/ReviewReportsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StudentDashboardLayout>
        <Routes>
          <Route index element={<StudentDashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportDetails />} />
          <Route path="reports/submit" element={<SubmitReport />} />
          <Route path="reports/review" element={<ReviewReportsPage />} />
          {/* Other student routes */}
        </Routes>
      </StudentDashboardLayout>} />
    </Routes>
  );
};

export default AppRoutes; 