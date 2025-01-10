import {
    ChartBarIcon,
    ClipboardDocumentCheckIcon,
    DocumentTextIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import DashboardLayout from '../Layout/DashboardLayout';
import ReportDetailView from '../reports/ReportDetailView';
import ReportEvaluation from '../reports/ReportEvaluation';
import TeacherReportsList from '../reports/TeacherReportsList';

const TeacherDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showEvaluationModal, setShowEvaluationModal] = useState(false);
    const [showReportDetail, setShowReportDetail] = useState(false);
    const [activeTab, setActiveTab] = useState('pending'); // ['pending', 'under_review', 'evaluated']
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            console.log('Fetching teacher dashboard data...');
            const response = await getDashboardData('teacher');
            console.log('Teacher Dashboard Response:', response);
            if (!response || !response.stats) {
                throw new Error('Invalid dashboard data received');
            }
            setData(response);
            setError(null);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEvaluateReport = (report) => {
        setSelectedReport(report);
        setShowEvaluationModal(true);
    };

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setShowReportDetail(true);
    };

    const getFilteredReports = () => {
        if (!data?.reports) return [];

        switch (activeTab) {
            case 'pending':
                return data.reports.filter(r => r.status === 'pending');
            case 'under_review':
                return data.reports.filter(r => r.status === 'under_review');
            case 'evaluated':
                return data.reports.filter(r => ['approved', 'rejected'].includes(r.status));
            default:
                return data.reports;
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            under_review: 'bg-blue-100 text-blue-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        </DashboardLayout>
    );

    if (error) return (
        <DashboardLayout>
            <div className="text-red-600 text-center p-4">
                {error}
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Statistics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <DocumentTextIcon className="h-10 w-10 text-emerald-500" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">Pending Reports</h3>
                                <p className="text-3xl font-bold">{data?.stats?.pending_reports || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <UserGroupIcon className="h-10 w-10 text-blue-500" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">Active Students</h3>
                                <p className="text-3xl font-bold">{data?.stats?.active_students || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <ClipboardDocumentCheckIcon className="h-10 w-10 text-purple-500" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">Evaluated Reports</h3>
                                <p className="text-3xl font-bold">{data?.stats?.evaluated_reports || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <ChartBarIcon className="h-10 w-10 text-yellow-500" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">Under Review</h3>
                                <p className="text-3xl font-bold">{data?.stats?.under_review || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reports Section */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">Reports Management</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`px-4 py-2 rounded-md ${activeTab === 'pending'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setActiveTab('under_review')}
                                    className={`px-4 py-2 rounded-md ${activeTab === 'under_review'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    Under Review
                                </button>
                                <button
                                    onClick={() => setActiveTab('evaluated')}
                                    className={`px-4 py-2 rounded-md ${activeTab === 'evaluated'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    Evaluated
                                </button>
                            </div>
                        </div>

                        <TeacherReportsList
                            reports={getFilteredReports()}
                            onEvaluate={handleEvaluateReport}
                            onView={handleViewReport}
                        />
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
                    <div className="space-y-4">
                        {data?.recent_activities?.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3 border-b pb-4">
                                {activity.type === 'report_submission' ? (
                                    <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                                ) : (
                                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-green-500" />
                                )}
                                <div>
                                    <p className="text-sm font-medium">
                                        {activity.type === 'report_submission'
                                            ? `${activity.student} submitted a report`
                                            : `Evaluated ${activity.student}'s report`}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(activity.date).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modals */}
                {showReportDetail && selectedReport && (
                    <ReportDetailView
                        report={selectedReport}
                        onClose={() => {
                            setShowReportDetail(false);
                            setSelectedReport(null);
                        }}
                    />
                )}

                {showEvaluationModal && selectedReport && (
                    <ReportEvaluation
                        report={selectedReport}
                        onClose={() => {
                            setShowEvaluationModal(false);
                            setSelectedReport(null);
                        }}
                        onSubmit={() => {
                            setShowEvaluationModal(false);
                            setSelectedReport(null);
                            fetchData(); // Refresh dashboard data
                        }}
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default TeacherDashboard;