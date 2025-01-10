import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentDashboardLayout from '../layouts/StudentDashboardLayout';
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import Reports from '../pages/reports/Reports';
import ReportDetails from '../pages/reports/ReportDetails';
import SubmitReport from '../pages/reports/SubmitReport';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StudentDashboardLayout>
        <Routes>
          <Route index element={<StudentDashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportDetails />} />
          <Route path="reports/submit" element={<SubmitReport />} />
          {/* Other student routes */}
        </Routes>
      </StudentDashboardLayout>} />
    </Routes>
  );
};

export default AppRoutes; 