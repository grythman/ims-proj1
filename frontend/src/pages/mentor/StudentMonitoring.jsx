import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import {
    UserIcon,
    DocumentTextIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const StudentMonitoring = () => {
    const { studentId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    const fetchStudentData = async () => {
        try {
            const [studentResponse, reportsResponse] = await Promise.all([
                api.get(`/api/internships/mentor/students/${studentId}/`),
                api.get(`/api/internships/mentor/students/${studentId}/reports/`)
            ]);

            setStudentData(studentResponse.data);
            setReports(reportsResponse.data);
        } catch (err) {
            setError('Failed to fetch student data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6">
            {/* Student Info */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 rounded-full p-3">
                        <UserIcon className="h-8 w-8 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {studentData.full_name}
                        </h2>
                        <p className="text-gray-500">
                            Progress: {studentData.completion_percentage}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Reports Submitted
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {studentData.reports_submitted}
                            </p>
                        </div>
                        <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Average Performance
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {studentData.average_performance?.toFixed(1) || 'N/A'}
                            </p>
                        </div>
                        <ChartBarIcon className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Days Remaining
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {studentData.days_remaining}
                            </p>
                        </div>
                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Recent Reports
                    </h3>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {reports.map((report) => (
                            <li key={report.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {report.title}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Submitted: {new Date(report.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            report.status === 'approved' 
                                                ? 'bg-green-100 text-green-800'
                                                : report.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {report.status}
                                        </span>
                                        <button
                                            onClick={() => navigate(`/mentor/reports/${report.id}`)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Review
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StudentMonitoring; 