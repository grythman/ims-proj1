import React from 'react';

const SystemStats = ({ data }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
                title="Total Users"
                value={data.totalUsers}
                icon="👥"
            />
            <StatCard
                title="Active Internships"
                value={data.activeInternships}
                icon="📋"
            />
            <StatCard
                title="Organizations"
                value={data.totalOrganizations}
                icon="🏢"
            />
            <StatCard
                title="Pending Approvals"
                value={data.pendingApprovals}
                icon="⏳"
            />
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className="text-3xl">{icon}</div>
        </div>
    </div>
);

export default SystemStats; 