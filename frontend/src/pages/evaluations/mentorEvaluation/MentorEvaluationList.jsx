import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck } from 'lucide-react';

const MentorEvaluationList = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await fetch('/api/mentor-evaluations');
        if (!response.ok) {
          throw new Error('Failed to fetch evaluations');
        }
        const data = await response.json();
        setEvaluations(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mentor Evaluations</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y">
          {evaluations.map((evaluation) => (
            <Link
              key={evaluation.id}
              to={`${evaluation.id}`}
              className="flex items-center p-4 hover:bg-gray-50"
            >
              <UserCheck className="h-6 w-6 text-emerald-600 mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{evaluation.title}</h3>
                <p className="text-sm text-gray-500">{evaluation.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorEvaluationList; 