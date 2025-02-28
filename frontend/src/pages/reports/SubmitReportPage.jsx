import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import ReportForm from '../../components/Reports/ReportForm';
import api from '../../services/api';

const SubmitReportPage = () => {
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentInternship();
  }, []);

  const fetchCurrentInternship = async () => {
    try {
      const response = await api.get('/api/internships/my-internship/');
      if (!response.data) {
        throw new Error('No active internship found');
      }
      setInternship(response.data);
    } catch (error) {
      console.error('Error fetching internship:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          error.message ||
                          'Failed to load internship details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    toast.success('Report submitted successfully!');
    navigate('/student/reports');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="text-emerald-600 hover:text-emerald-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Reports
        </button>
      </div>

      {/* Internship Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Submit Report
        </h2>
        <div className="mt-2 text-sm text-gray-500">
          <p>
            Internship at {internship.organization?.name}
          </p>
          <p className="mt-1">
            {new Date(internship.start_date).toLocaleDateString()} - {new Date(internship.end_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Report Form */}
      <ReportForm 
        internship={internship}
        onSuccess={handleSuccess}
      />

      {/* Guidelines */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Report Writing Guidelines
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Be specific and provide concrete examples</li>
                <li>Focus on your learning outcomes and achievements</li>
                <li>Include challenges faced and how you overcame them</li>
                <li>Mention skills developed and knowledge gained</li>
                <li>Proofread your report before submission</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitReportPage; 