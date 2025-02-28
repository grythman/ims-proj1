import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, FileText, User, Building } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import api from '../../services/api';

const ApplicationReview = ({ application, onReview }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleReview = async (status) => {
    if (status === 'rejected' && !feedback.trim()) {
      toast.error('Please provide feedback for rejection');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/api/internships/applications/${application.id}/review/`, {
        status,
        feedback: feedback.trim()
      });

      toast.success(`Application ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`);
      if (onReview) {
        onReview(response.data);
      }
    } catch (error) {
      console.error('Error reviewing application:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          'Failed to review application';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Application Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Application Review
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {application.status_display}
          </span>
        </div>
      </div>

      {/* Application Details */}
      <div className="px-6 py-4 space-y-4">
        {/* Student Info */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">Student</h4>
            <p className="mt-1 text-sm text-gray-500">
              {application.student_name}
            </p>
          </div>
        </div>

        {/* Company Info */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Building className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">Position</h4>
            <p className="mt-1 text-sm text-gray-500">
              {application.internship_title} at {application.company_name}
            </p>
          </div>
        </div>

        {/* CV */}
        {application.cv_url && (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">CV</h4>
              <a 
                href={application.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm text-emerald-600 hover:text-emerald-700"
              >
                View CV
              </a>
            </div>
          </div>
        )}

        {/* Cover Letter */}
        {application.cover_letter && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">Cover Letter</h4>
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {application.cover_letter}
              </p>
            </div>
          </div>
        )}

        {/* Feedback Input */}
        <div className="mt-4">
          <label 
            htmlFor="feedback" 
            className="block text-sm font-medium text-gray-700"
          >
            Feedback
          </label>
          <div className="mt-1">
            <textarea
              id="feedback"
              rows={4}
              className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Provide feedback to the student..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="danger"
            disabled={loading}
            onClick={() => handleReview('rejected')}
            className="inline-flex items-center"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button
            type="button"
            variant="success"
            disabled={loading}
            onClick={() => handleReview('accepted')}
            className="inline-flex items-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Accept
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ApplicationReview; 