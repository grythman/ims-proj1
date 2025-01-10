import React from 'react';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const RecentActivities = () => {
    const { data, loading, error } = useApi('/dashboard/recent-activities/');

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Recent Activities</h2>
            <div className="space-y-4">
                {data?.map(activity => (
                    <div key={activity.id} className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'error' ? 'bg-red-500' :
                            activity.type === 'warning' ? 'bg-yellow-500' :
                            'bg-green-500'
                        }`} />
                        <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
                {data?.length === 0 && (
                    <p className="text-gray-500 text-center">No recent activities</p>
                )}
            </div>
        </div>
    );
};

export default RecentActivities; 