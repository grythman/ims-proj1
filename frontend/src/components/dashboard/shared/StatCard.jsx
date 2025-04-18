import React from 'react';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className={`${color} p-3 rounded-full text-white`}>
                {icon}
            </div>
        </div>
    </div>
);

export default StatCard; 