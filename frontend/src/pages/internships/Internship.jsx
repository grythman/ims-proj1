import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InternshipList from './InternshipList';
import ViewInternship from './ViewInternship';
import ApplyInternship from './ApplyInternship';
import RegisterInternship from './RegisterInternship';

const Internship = () => {
  return (
    <Routes>
      <Route index element={<InternshipList />} />
      <Route path=":internshipId" element={<ViewInternship />} />
      <Route path="apply" element={<ApplyInternship />} />
      <Route path="register" element={<RegisterInternship />} />
    </Routes>
  );
};

export default Internship; 