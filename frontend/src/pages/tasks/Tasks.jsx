import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    ClipboardDocumentListIcon,
    FunnelIcon,
    PlusIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const Tasks = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('due_date');

    const fetchTasks = useCallback(async () => {
        try {
            const response = await api.get('/api/tasks/', {
                params: {
                    status: filter !== 'all' ? filter : undefined,
                    ordering: sortBy
                }
            });
            setTasks(response.data);
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    }, [filter, sortBy]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleFilterChange = useCallback((newFilter) => {
        setFilter(newFilter);
    }, []);

    const handleSortChange = useCallback((newSort) => {
        setSortBy(newSort);
    }, []);

    const handleCreateTask = useCallback(() => {
        navigate('/tasks/create');
    }, [navigate]);

    const handleTaskClick = useCallback((taskId) => {
        navigate(`/tasks/${taskId}`);
    }, [navigate]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
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
                        <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" />
                        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                    </div>
                    {user?.user_type !== 'student' && (
                        <button
                            onClick={handleCreateTask}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Create Task
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex flex-wrap gap-4">
                        <div className="relative">
                            <select
                                value={filter}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="appearance-none pl-8 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Tasks</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <FunnelIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="appearance-none pl-8 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="due_date">Due Date</option>
                                <option value="priority">Priority</option>
                                <option value="-created_at">Created Date</option>
                            </select>
                            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="p-6 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleTaskClick(task.id)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {task.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {task.description}
                                    </p>
                                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                                        <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>Assigned by: {task.assigned_by_name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                    {task.status_display}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority_display}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No tasks found
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks; 