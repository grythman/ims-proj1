import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';
import { Spinner } from '../../../components/UI/Spinner';

const TeacherEvaluationList = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/evaluations/teacher/evaluations/');
        setEvaluations(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
        toast.error('Failed to load evaluations');
        setEvaluations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Teacher Evaluations</h2>
      <div className="bg-white rounded-lg shadow">
        {evaluations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No evaluations found
          </div>
        ) : (
          <div className="divide-y">
            {evaluations.map((evaluation) => (
              <Link
                key={evaluation.id}
                to={`${evaluation.id}`}
                className="flex items-center p-4 hover:bg-gray-50"
              >
                <User className="h-6 w-6 text-emerald-600 mr-4" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {evaluation.student_name}
                    </h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-600">
                        {evaluation.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500">
                      {new Date(evaluation.created_at).toLocaleDateString()}
                    </p>
                    {evaluation.is_final && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                        Final
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherEvaluationList; 