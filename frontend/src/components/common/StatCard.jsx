import React from 'react';

const StatCard = ({ title, value, icon, color, trend, urgency }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-semibold mt-1">{value}</p>
                </div>
                <div className={`${color} p-3 rounded-lg`}>
                    <span className="text-white text-xl">{icon}</span>
                </div>
            </div>
            {trend && (
                <p className="text-sm mt-2 text-gray-600">
                    Growth: <span className="font-medium">{trend}</span>
                </p>
            )}
            {urgency && (
                <div className={`mt-2 text-sm ${
                    urgency === 'high' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                    {urgency === 'high' ? 'Requires Attention' : 'Normal Priority'}
                </div>
            )}
        </div>
    );
};

export default StatCard; 