import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Plus } from 'lucide-react';

const EvaluationsList = () => {
  // Replace this with actual data fetched from your API
  const evaluations = [
    { id: 1, title: 'Midterm Evaluation', date: '2024-04-15', status: 'completed' },
    { id: 2, title: 'Final Evaluation', date: '2024-06-30', status: 'pending' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Evaluations</h2>
        <Link
          to="submit"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Submit Evaluation
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="divide-y">
          {evaluations.map((evaluation) => (
            <Link
              key={evaluation.id}
              to={`${evaluation.id}`}
              className="flex items-center p-4 hover:bg-gray-50"
            >
              <CheckCircle className="h-6 w-6 text-emerald-600 mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{evaluation.title}</h3>
                <p className="text-sm text-gray-500">{evaluation.date}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  evaluation.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {evaluation.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationsList; 