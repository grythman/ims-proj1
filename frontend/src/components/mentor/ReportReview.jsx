import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  FileText, 
  Download, 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import mentorApi from '../../services/mentorApi';

const ReportCard = ({ report, onReview }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{report.title}</h3>
              <p className="text-sm text-gray-500">
                By {report.student_name} • {report.submission_date}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-sm ${
              report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              report.status === 'reviewed' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {report.status}
            </span>
          </div>

          {/* Report Type & Details */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{report.type} Report</span>
            <span>•</span>
            <span>{report.page_count} pages</span>
            <span>•</span>
            <span>{report.word_count} words</span>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(report.download_url)}
              className="text-blue-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onReview(report)}
            >
              Review Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewForm = ({ report, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comments: '',
    strengths: '',
    improvements: '',
    recommendations: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${
                star <= formData.rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
              onClick={() => setFormData({ ...formData, rating: star })}
            />
          ))}
        </div>
      </div>

      {/* Comments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          General Comments
        </label>
        <textarea
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          rows={4}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* Strengths */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Strengths
        </label>
        <textarea
          value={formData.strengths}
          onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
          rows={3}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* Areas for Improvement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Areas for Improvement
        </label>
        <textarea
          value={formData.improvements}
          onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
          rows={3}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* Recommendations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recommendations
        </label>
        <textarea
          value={formData.recommendations}
          onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
          rows={3}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          Submit Review
        </Button>
      </div>
    </form>
  );
};

const ReportReview = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await mentorApi.reports.getPendingReports();
      setReports(data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (report) => {
    setSelectedReport(report);
    setShowReviewForm(true);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await mentorApi.reports.reviewReport(selectedReport.id, reviewData);
      toast.success('Review submitted successfully');
      setShowReviewForm(false);
      fetchReports(); // Refresh the list
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showReviewForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Review Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewForm
              report={selectedReport}
              onSubmit={handleSubmitReview}
              onCancel={() => setShowReviewForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Student Reports</h2>
            <span className="text-sm text-gray-500">
              {reports.length} reports pending review
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onReview={handleReview}
              />
            ))}
          </div>

          {reports.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No reports to review</h3>
                <p className="text-gray-500 mt-1">
                  All student reports have been reviewed
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ReportReview; 