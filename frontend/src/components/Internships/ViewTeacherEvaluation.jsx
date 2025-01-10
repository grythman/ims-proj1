import React, { useEffect, useState } from 'react';
import { getTeacherEvaluation } from '../../services/api';

const ViewTeacherEvaluation = ({ internshipId }) => {
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      const data = await getTeacherEvaluation(internshipId);
      setEvaluation(data);
    };
    fetchEvaluation();
  }, [internshipId]);

  return (
    <div className="teacher-evaluation">
      <h2>Teacher's Evaluation</h2>
      {evaluation ? (
        <div>
          <p>{evaluation.comments}</p>
          <p>Score: {evaluation.score}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewTeacherEvaluation; 