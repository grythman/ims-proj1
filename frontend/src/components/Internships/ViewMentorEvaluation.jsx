import React, { useEffect, useState } from 'react';
import { getMentorEvaluation } from '../../services/api';

const ViewMentorEvaluation = ({ internshipId }) => {
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      const data = await getMentorEvaluation(internshipId);
      setEvaluation(data);
    };
    fetchEvaluation();
  }, [internshipId]);

  return (
    <div className="mentor-evaluation">
      <h2>Mentor's Evaluation</h2>
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

export default ViewMentorEvaluation; 