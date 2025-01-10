import {
    AcademicCapIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import InternshipDuration from '../internships/InternshipDuration';
import DashboardLayout from '../Layout/DashboardLayout';
import PreliminaryReportCheck from '../reports/PreliminaryReportCheck';

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSubmitReport, setShowSubmitReport] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    const [showEvaluationModal, setShowEvaluationModal] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await getDashboardData('student');
            setData(response);
            setError(null);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleViewEvaluation = (evaluation) => {
        setSelectedEvaluation(evaluation);
        setShowEvaluationModal(true);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <QuickActionCard
                        icon={DocumentTextIcon}
                        title="Submit Report"
                        onClick={() => setShowSubmitReport(true)}
                    />
                    <QuickActionCard
                        icon={AcademicCapIcon}
                        title="Register Internship"
                        onClick={() => navigate('/internships/register')}
                        disabled={data?.internship}
                    />
                    <QuickActionCard
                        icon={PencilIcon}
                        title="Edit Profile"
                        onClick={() => setShowEditProfile(true)}
                    />
                    <QuickActionCard
                        icon={ChatBubbleLeftRightIcon}
                        title="Messages"
                        onClick={() => navigate('/messages')}
                        badge={data?.unread_messages}
                    />
                </div>

                {/* Profile Completion & Internship Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileCompletion profile={data?.profile} />
                    <InternshipStatus internship={data?.internship} />
                </div>

                {/* Reports & Evaluations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ReportsSection
                        reports={data?.reports}
                        onSubmitReport={() => setShowSubmitReport(true)}
                    />
                    <EvaluationsSection
                        evaluations={data?.evaluations}
                        onViewEvaluation={handleViewEvaluation}
                    />
                </div>

                {/* Internship Duration */}
                {data?.internship && (
                    <InternshipDuration internship={data.internship} />
                )}

                {/* Preliminary Report */}
                {data?.preliminary_report && (
                    <PreliminaryReportCheck
                        report={data.preliminary_report}
                        onEdit={() => setShowSubmitReport(true)}
                    />
                )}

                {/* Modals */}
                <SubmitReportModal
                    open={showSubmitReport}
                    onClose={() => setShowSubmitReport(false)}
                    onSubmit={fetchData}
                />
                <EditProfileModal
                    open={showEditProfile}
                    onClose={() => setShowEditProfile(false)}
                    onSubmit={fetchData}
                />
                <EvaluationModal
                    open={showEvaluationModal}
                    evaluation={selectedEvaluation}
                    onClose={() => {
                        setShowEvaluationModal(false);
                        setSelectedEvaluation(null);
                    }}
                />
            </div>
        </DashboardLayout>
    );
};

// Helper Components
const QuickActionCard = ({ icon: Icon, title, onClick, disabled, badge }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow ${disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
    >
        <div className="flex items-center space-x-3">
            <Icon className="h-6 w-6 text-emerald-500" />
            <span className="font-medium">{title}</span>
            {badge && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {badge}
                </span>
            )}
        </div>
    </button>
);

// ... other component exports

export default StudentDashboard; 