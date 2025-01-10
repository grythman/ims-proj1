import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

const InternshipDuration = ({ internship }) => {
    const calculateDuration = () => {
        const start = new Date(internship.start_date);
        const end = new Date(internship.end_date);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diffDays / 7);
        const days = diffDays % 7;
        
        return {
            weeks,
            days,
            total_days: diffDays
        };
    };

    const duration = calculateDuration();

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <ClockIcon className="h-6 w-6 text-blue-500 mr-2" />
                    <h2 className="text-lg font-semibold">Internship Duration</h2>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {duration.total_days} days
                </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{new Date(internship.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">{new Date(internship.end_date).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-600">
                    Duration: {duration.weeks} weeks {duration.days > 0 ? `and ${duration.days} days` : ''}
                </p>
            </div>
        </div>
    );
};

export default InternshipDuration; 