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
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentActions, setRecentActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data for when API fails
    const mockStats = {
        total_users: 324,
        total_reports: 156,
        students_active: 210,
        mentors_active: 45,
        pending_reports: 12
    };

    const mockRecentActions = [
        {
            id: 1,
            user: 'Батбаяр Дорж',
            action: 'Бүртгүүлсэн',
            object: 'Дадлага хөтөлбөр',
            time: new Date().toISOString()
        },
        {
            id: 2,
            user: 'Оюунцэцэг Бат',
            action: 'Илгээсэн',
            object: 'Тайлан #45',
            time: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        },
        {
            id: 3, 
            user: 'Ганболд Баатар',
            action: 'Шалгасан',
            object: 'Тайлан #32',
            time: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
        }
    ];

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
            console.error('Error fetching admin data:', err);
            setError('Өгөгдөл ачаалахад алдаа гарлаа. Түр зуурын өгөгдлийг харуулж байна.');
            
            // Use mock data when API fails
            setStats(mockStats);
            setRecentActions(mockRecentActions);
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
            {/* Welcome Message */}
            <div className="bg-white overflow-hidden shadow rounded-lg p-4">
                <div className="flex items-center">
                    <AcademicCapIcon className="h-8 w-8 text-indigo-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">
                        Тавтай морил, {user?.first_name || 'Админ'}!
                    </h2>
                </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Уншиж байна...</span>
                    </div>
                </div>
            )}
            
            {error && (
                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <BellIcon className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-indigo-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <UsersIcon className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Нийт хэрэглэгч
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats?.total_users || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ClipboardDocumentListIcon className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Нийт тайлан
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats?.total_reports || 0}
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
                        Сүүлийн үйлдлүүд
                    </h3>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {recentActions.length > 0 ? (
                            recentActions.map((action, index) => (
                                <li key={action.id || index} className="px-4 py-4">
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
                            ))
                        ) : (
                            <li className="px-4 py-4 text-center text-gray-500">
                                Үйлдэл бүртгэгдээгүй байна
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* System Message Form */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Системийн мэдэгдэл илгээх
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
                                Гарчиг
                            </label>
                            <input
                                type="text"
                                name="title"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Мэдэгдэл
                            </label>
                            <textarea
                                name="message"
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Хүлээн авагчид
                            </label>
                            <div className="mt-2 space-y-2">
                                {['student', 'mentor', 'teacher'].map(type => (
                                    <div key={type} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="recipients"
                                            value={type}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 text-sm text-gray-700">
                                            {type === 'student' ? 'Оюутнууд' : 
                                            type === 'mentor' ? 'Менторууд' : 
                                            'Багш нар'}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Илгээх
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard; 