import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './shared/StatCard';
import ActionCard from './shared/ActionCard';

const AdminDashboard = ({ data }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Users"
                    value={data?.total_users || 0}
                    icon="👥"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Active Internships"
                    value={data?.active_internships || 0}
                    icon="🏢"
                    color="bg-green-500"
                />
                <StatCard
                    title="Organizations"
                    value={data?.total_organizations || 0}
                    icon="🏛️"
                    color="bg-purple-500"
                />
            </div>

            {/* User Distribution */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">User Distribution</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data?.user_types?.map((type, index) => (
                        <div key={index} className="text-center">
                            <p className="text-2xl font-bold">{type.count}</p>
                            <p className="text-sm text-gray-500">{type.user_type}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Recent Registrations</h2>
                <div className="space-y-4">
                    {data?.recent_registrations?.map((user, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{user.username}</p>
                                <p className="text-sm text-gray-500">{user.user_type}</p>
                            </div>
                            <p className="text-sm text-gray-500">
                                {new Date(user.date_joined).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ActionCard
                    title="Manage Users"
                    description="Add or modify user accounts"
                    icon="👤"
                    onClick={() => navigate('/users')}
                />
                <ActionCard
                    title="Organizations"
                    description="Manage partner organizations"
                    icon="🏢"
                    onClick={() => navigate('/organizations')}
                />
                <ActionCard
                    title="System Settings"
                    description="Configure system parameters"
                    icon="⚙️"
                    onClick={() => navigate('/settings')}
                />
            </div>
        </div>
    );
};

export default AdminDashboard; 