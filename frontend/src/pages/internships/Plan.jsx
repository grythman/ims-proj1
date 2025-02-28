import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    ClipboardDocumentListIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';

const Plan = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [plan, setPlan] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        content: '',
        internship: user?.internship?.id || ''
    });

    useEffect(() => {
        if (user?.internship?.id) {
            fetchActivePlan();
        }
    }, [user]);

    const fetchActivePlan = async () => {
        try {
            const response = await api.get(`/internships/${user.internship.id}/plan/`);
            if (response.data) {
                setPlan(response.data);
                setFormData({
                    content: response.data.content,
                    internship: response.data.internship
                });
            }
        } catch (err) {
            console.error('Error fetching plan:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            let response;
            if (plan) {
                response = await api.put(`/internships/plans/${plan.id}/`, formData);
            } else {
                response = await api.post('/internships/plans/', formData);
            }
            setPlan(response.data);
            setIsEditing(false);
            setSuccess('Plan saved successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save plan');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (status, feedback = '') => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.post(`/internships/plans/${plan.id}/review/`, {
                status,
                feedback
            });
            setPlan(response.data);
            setSuccess(`Plan ${status} successfully`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to review plan');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center gap-3">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" />
                    <h1 className="text-2xl font-bold text-gray-900">Internship Plan</h1>
                </div>
                <p className="mt-1 text-gray-500">
                    Create and manage your internship plan
                </p>
            </div>

            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}

            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                {/* Plan Status */}
                {plan && (
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Plan Status
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Current status of your internship plan
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plan.status)}`}>
                                {plan.status_display}
                            </span>
                        </div>
                    </div>
                )}

                {/* Plan Content */}
                <div className="p-6">
                    {isEditing || !plan ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Plan Content
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        content: e.target.value
                                    }))}
                                    rows={15}
                                    className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                {plan && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {loading ? 'Saving...' : 'Save Plan'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Plan Content
                                </h2>
                                {plan.can_edit && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-1.5" />
                                        Edit
                                    </button>
                                )}
                            </div>
                            <div className="prose max-w-none">
                                {plan.content.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-4">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Review Section */}
                {plan && plan.can_review && plan.status === 'pending' && (
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Review Plan
                        </h2>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => handleReview('approved')}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircleIcon className="h-5 w-5 mr-2" />
                                Approve
                            </button>
                            <button
                                onClick={() => handleReview('rejected')}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                            >
                                <XCircleIcon className="h-5 w-5 mr-2" />
                                Reject
                            </button>
                        </div>
                    </div>
                )}

                {/* Feedback Section */}
                {plan && plan.feedback && (
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Feedback
                        </h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700">{plan.feedback}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Plan; 