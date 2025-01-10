import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReportsList from './ReportsList';
import SubmitReport from './SubmitReport';
import ReportDetails from './ReportDetails';

const Reports = () => {
  return (
    <Routes>
      <Route index element={<ReportsList />} />
      <Route path="submit" element={<SubmitReport />} />
      <Route path=":reportId" element={<ReportDetails />} />
    </Routes>
  );
};

export default Reports; 