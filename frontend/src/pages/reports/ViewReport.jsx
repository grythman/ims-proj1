import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  // This would be replaced with actual data fetching
  const report = {
    id: reportId,
    title: `Weekly Report ${reportId}`,
    date: '2024-03-20',
    content: 'Report content goes here...',
    status: 'submitted'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{report.title}</h2>
        <button
          onClick={() => navigate('/dashboard/reports')}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Reports
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              report.status === 'submitted'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {report.status}
          </span>
          <p className="text-sm text-gray-500 mt-2">{report.date}</p>
        </div>
        <div className="prose max-w-none">
          <p>{report.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewReport; 