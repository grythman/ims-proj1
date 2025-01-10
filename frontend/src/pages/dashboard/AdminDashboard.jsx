import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    UsersIcon,
    AcademicCapIcon,
    ClipboardDocumentListIcon,
    BellIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentActions, setRecentActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [statsResponse, actionsResponse] = await Promise.all([
                api.get('/admin/dashboard-stats/'),
                api.get('/admin/recent-actions/')
            ]);
            setStats(statsResponse.data);
            setRecentActions(actionsResponse.data);
        } catch (err) {
            setError('Failed to fetch admin data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const sendSystemMessage = async (data) => {
        try {
            await api.post('/admin/system-message/', data);
            // Show success message
        } catch (err) {
            // Show error message
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <UsersIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Users
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats?.total_users || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Add more stat cards */}
            </div>

            {/* Recent Actions */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Recent Actions
                    </h3>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {recentActions.map((action, index) => (
                            <li key={index} className="px-4 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {action.user}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {action.action} - {action.object}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {new Date(action.time).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* System Message Form */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Send System Message
                </h3>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    sendSystemMessage({
                        title: formData.get('title'),
                        message: formData.get('message'),
                        recipients: formData.getAll('recipients')
                    });
                }}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Message
                            </label>
                            <textarea
                                name="message"
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Recipients
                            </label>
                            <div className="mt-2 space-y-2">
                                {['student', 'mentor', 'teacher'].map(type => (
                                    <div key={type} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="recipients"
                                            value={type}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 text-sm text-gray-700">
                                            {type.charAt(0).toUpperCase() + type.slice(1)}s
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard; 