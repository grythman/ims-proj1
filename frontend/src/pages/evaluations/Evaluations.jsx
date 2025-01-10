import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EvaluationsList from './EvaluationsList';
import MentorEvaluation from './mentorEvaluation/MentorEvaluation';
import TeacherEvaluation from './teacherEvaluation/TeacherEvaluation';

const Evaluations = () => {
  return (
    <Routes>
      <Route index element={<EvaluationsList />} />
      <Route path="mentor/*" element={<MentorEvaluation />} />
      <Route path="teacher/*" element={<TeacherEvaluation />} />
    </Routes>
  );
};

export default Evaluations; 