import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeacherEvaluationList from './TeacherEvaluationList';
import ViewTeacherEvaluation from './ViewTeacherEvaluation';

const TeacherEvaluation = () => {
  return (
    <Routes>
      <Route index element={<TeacherEvaluationList />} />
      <Route path=":evaluationId" element={<ViewTeacherEvaluation />} />
    </Routes>
  );
};

export default TeacherEvaluation; 