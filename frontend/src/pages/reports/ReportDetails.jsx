import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ReportDetails = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/reports/${reportId}/`);
        setReport(response.data);
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) {
    return <p>Loading report details...</p>;
  }

  if (!report) {
    return <p>Report not found.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
          <p className="text-sm text-gray-500">
            Submitted on {report.submitted_at}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/reports')}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Reports
        </button>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm capitalize ${
              report.status === 'evaluated'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {report.status}
          </span>
        </div>
        <div className="prose max-w-none">
          <p>{report.content}</p>
        </div>
        {report.attachment && (
          <div className="mt-6">
            <a
              href={report.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Download Attachment
            </a>
          </div>
        )}
      </div>

      {/* Feedback Section (Optional) */}
      {report.feedback && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Feedback</h2>
          <div className="prose max-w-none">
            <p>{report.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetails; 