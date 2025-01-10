import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MentorEvaluationList from './MentorEvaluationList';
import ViewMentorEvaluation from './ViewMentorEvaluation';

const MentorEvaluation = () => {
  return (
    <Routes>
      <Route index element={<MentorEvaluationList />} />
      <Route path=":evaluationId" element={<ViewMentorEvaluation />} />
    </Routes>
  );
};

export default MentorEvaluation; 