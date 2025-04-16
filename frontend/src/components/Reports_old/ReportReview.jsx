import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, FileText, User, Calendar, Star } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import api from '../../services/api';

const ReportReview = ({ report, onReview }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [ratings, setRatings] = useState({
    content_quality: 5,
    writing_quality: 5,
    timeliness: 5,
    overall: 5
  });

  const handleRatingChange = (type, value) => {
    setRatings(prev => ({
      ...prev,
      [type]: value,
      overall: type === 'overall' ? value : prev.overall
    }));
  };

  const handleReview = async (status) => {
    if (status === 'rejected' && !feedback.trim()) {
      toast.error('Please provide feedback for rejection');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/api/reports/${report.id}/review/`, {
        status,
        feedback: feedback.trim(),
        ratings
      });

      toast.success(`Report ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      if (onReview) {
        onReview(response.data);
      }
    } catch (error) {
      console.error('Error reviewing report:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          'Failed to review report';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const RatingInput = ({ label, value, onChange }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
              rating <= value ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      {/* Report Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Report Review
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {report.status}
          </span>
        </div>
      </div>

      {/* Report Details */}
      <div className="px-6 py-4 space-y-4">
        {/* Student Info */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">Student</h4>
            <p className="mt-1 text-sm text-gray-500">
              {report.student_name}
            </p>
          </div>
        </div>

        {/* Report Info */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">Report Details</h4>
            <p className="mt-1 text-sm text-gray-500">
              {report.title} ({report.report_type})
            </p>
          </div>
        </div>

        {/* Submission Date */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">Submitted</h4>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(report.submitted_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Report Content */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Report Content</h4>
          {Object.entries(report.content).map(([section, content]) => (
            <div key={section} className="mb-4">
              <h5 className="text-sm font-medium text-gray-700">{section}</h5>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Attachments */}
        {report.attachments?.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
            <div className="space-y-2">
              {report.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-emerald-600 hover:text-emerald-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {attachment.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Ratings */}
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Evaluation</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RatingInput
              label="Content Quality"
              value={ratings.content_quality}
              onChange={(value) => handleRatingChange('content_quality', value)}
            />
            <RatingInput
              label="Writing Quality"
              value={ratings.writing_quality}
              onChange={(value) => handleRatingChange('writing_quality', value)}
            />
            <RatingInput
              label="Timeliness"
              value={ratings.timeliness}
              onChange={(value) => handleRatingChange('timeliness', value)}
            />
            <RatingInput
              label="Overall Rating"
              value={ratings.overall}
              onChange={(value) => handleRatingChange('overall', value)}
            />
          </div>
        </div>

        {/* Feedback Input */}
        <div className="mt-6">
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
            onClick={() => handleReview('approved')}
            className="inline-flex items-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReportReview; 