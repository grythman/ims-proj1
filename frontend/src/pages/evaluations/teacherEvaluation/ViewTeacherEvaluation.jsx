import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewTeacherEvaluation = () => {
  const { evaluationId } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    // Fetch the specific teacher evaluation from the API
    // Replace with actual API call
    const fetchEvaluation = async () => {
      // Example data
      const data = {
        id: evaluationId,
        title: `Evaluation ${evaluationId}`,
        date: '2023-11-10',
        content: 'Detailed evaluation from your teacher.',
      };
      setEvaluation(data);
    };

    fetchEvaluation();
  }, [evaluationId]);

  if (!evaluation) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{evaluation.title}</h2>
        <button
          onClick={() => navigate('/dashboard/teacher-evaluation')}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Evaluations
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-sm text-gray-500">{evaluation.date}</p>
        <div className="prose max-w-none mt-4">
          <p>{evaluation.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewTeacherEvaluation; 