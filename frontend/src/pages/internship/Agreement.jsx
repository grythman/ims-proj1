import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    DocumentTextIcon,
    BuildingOfficeIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowDownTrayIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';

const Agreement = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [agreement, setAgreement] = useState(null);
    const [formData, setFormData] = useState({
        organization: '',
        start_date: '',
        end_date: '',
        internship: ''
    });

    useEffect(() => {
        fetchOrganizations();
        fetchActiveAgreement();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const response = await api.get('/companies/organizations/');
            setOrganizations(response.data);
        } catch (err) {
            setError('Failed to fetch organizations');
            console.error('Error fetching organizations:', err);
        }
    };

    const fetchActiveAgreement = async () => {
        try {
            const response = await api.get('/internships/agreements/active/');
            if (response.data) {
                setAgreement(response.data);
            }
        } catch (err) {
            console.error('Error fetching agreement:', err);
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
            const response = await api.post('/internships/agreements/', formData);
            setAgreement(response.data);
            setSuccess('Agreement created successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create agreement');
        } finally {
            setLoading(false);
        }
    };

    const handleSign = async (userType) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.post(`/internships/agreements/${agreement.id}/sign/`, {
                user_type: userType
            });
            await fetchActiveAgreement();
            setSuccess('Agreement signed successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sign agreement');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await api.get(`/internships/agreements/${agreement.id}/download/`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `agreement_${agreement.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Failed to download agreement');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center gap-3">
                    <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                    <h1 className="text-2xl font-bold text-gray-900">Internship Agreement</h1>
                </div>
                <p className="mt-1 text-gray-500">
                    Create and manage your internship agreement
                </p>
            </div>

            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}

            {agreement ? (
                // Show existing agreement
                <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                    {/* Agreement Status */}
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Agreement Status
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Current status of your internship agreement
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                agreement.status === 'approved' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {agreement.status_display}
                            </span>
                        </div>
                    </div>

                    {/* Agreement Details */}
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Agreement Details
                        </h2>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Organization</dt>
                                <dd className="mt-1 text-sm text-gray-900">{agreement.organization.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Department</dt>
                                <dd className="mt-1 text-sm text-gray-900">{agreement.organization.department}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {new Date(agreement.start_date).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">End Date</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {new Date(agreement.end_date).toLocaleDateString()}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Signatures */}
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Signatures
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-sm font-medium text-gray-900">Student</span>
                                </div>
                                {agreement.student_signature ? (
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                ) : (
                                    agreement.can_sign_student && (
                                        <button
                                            onClick={() => handleSign('student')}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Sign
                                        </button>
                                    )
                                )}
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-sm font-medium text-gray-900">Organization</span>
                                </div>
                                {agreement.organization_signature ? (
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                ) : (
                                    agreement.can_sign_organization && (
                                        <button
                                            onClick={() => handleSign('organization')}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Sign
                                        </button>
                                    )
                                )}
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-sm font-medium text-gray-900">University</span>
                                </div>
                                {agreement.university_signature ? (
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                ) : (
                                    agreement.can_sign_university && (
                                        <button
                                            onClick={() => handleSign('university')}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Sign
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6">
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
                                Download Agreement
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Show agreement creation form
                <div className="bg-white shadow rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Organization
                            </label>
                            <select
                                name="organization"
                                value={formData.organization}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    organization: e.target.value
                                }))}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                required
                            >
                                <option value="">Select an organization</option>
                                {organizations.map(org => (
                                    <option key={org.id} value={org.id}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        start_date: e.target.value
                                    }))}
                                    className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        end_date: e.target.value
                                    }))}
                                    className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Agreement'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Agreement; 