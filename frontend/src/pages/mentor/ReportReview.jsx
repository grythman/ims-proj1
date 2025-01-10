import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';

const ReportReview = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [report, setReport] = useState(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        fetchReportData();
    }, [reportId]);

    const fetchReportData = async () => {
        try {
            const response = await api.get(`/api/internships/mentor/reports/${reportId}/`);
            setReport(response.data);
        } catch (err) {
            setError('Failed to fetch report data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (status) => {
        try {
            setLoading(true);
            await api.post(`/api/internships/mentor/reports/${reportId}/review/`, {
                status,
                feedback
            });
            setSuccess('Report reviewed successfully');
            setTimeout(() => navigate('/mentor/reports'), 2000);
        } catch (err) {
            setError('Failed to submit review');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6">
            {success && <SuccessMessage message={success} />}

            {/* Report Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {report.title}
                            </h2>
                            <p className="text-gray-500">
                                Submitted by {report.student_name} on {new Date(report.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        report.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {report.status}
                    </span>
                </div>
            </div>

            {/* Report Content */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Report Content
                </h3>
                <div className="prose max-w-none">
                    {report.content}
                </div>
                {report.attachments && (
                    <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-900">
                            Attachments
                        </h4>
                        <div className="mt-2">
                            <a 
                                href={report.attachments}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                View Attachment
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Review Form */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Review Report
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Feedback
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Provide feedback for the student..."
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => handleReview('rejected')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                            <XCircleIcon className="h-5 w-5 mr-2" />
                            Reject
                        </button>
                        <button
                            onClick={() => handleReview('approved')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            Approve
                        </button>
                    </div>
                </div>
            </div>

            {/* Previous Feedback */}
            {report.previous_feedback && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Previous Feedback
                    </h3>
                    <div className="space-y-4">
                        {report.previous_feedback.map((feedback, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-900">
                                        {feedback.content}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        By {feedback.reviewer_name} on {new Date(feedback.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportReview; 