import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    CalendarIcon,
    ClockIcon,
    UserGroupIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const Meetings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('upcoming');

    const fetchMeetings = useCallback(async () => {
        try {
            const response = await api.get('/meetings/', {
                params: { filter }
            });
            setMeetings(response.data);
        } catch (err) {
            setError('Failed to fetch meetings');
            console.error('Error fetching meetings:', err);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="h-6 w-6 text-blue-500" />
                        <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
                    </div>
                    {user?.user_type !== 'student' && (
                        <button
                            onClick={() => navigate('/meetings/schedule')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Schedule Meeting
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-md ${
                            filter === 'upcoming'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded-md ${
                            filter === 'past'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        Past
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md ${
                            filter === 'all'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        All
                    </button>
                </div>
            </div>

            {/* Meetings List */}
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                {meetings.map((meeting) => (
                    <div
                        key={meeting.id}
                        className="p-6 hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/meetings/${meeting.id}`)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                <div className={`p-2 rounded-full ${getStatusColor(meeting.status)}`}>
                                    <CalendarIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {meeting.title}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center">
                                            <ClockIcon className="h-4 w-4 mr-1" />
                                            {new Date(meeting.start_time).toLocaleString()}
                                        </span>
                                        <span className="flex items-center">
                                            <UserGroupIcon className="h-4 w-4 mr-1" />
                                            {meeting.participants.length} participants
                                        </span>
                                    </div>
                                    {meeting.agenda && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            {meeting.agenda}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                                {meeting.status}
                            </span>
                        </div>
                    </div>
                ))}
                {meetings.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No meetings found
                    </div>
                )}
            </div>
        </div>
    );
};

export default Meetings; 