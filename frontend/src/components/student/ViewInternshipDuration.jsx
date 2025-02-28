import React from 'react';
import { Calendar } from 'lucide-react';
import { Card } from '../UI/Card';

const ViewInternshipDuration = ({ detailed, onClose }) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">
            Internship Duration
          </h3>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              January 1, 2024
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              June 30, 2024
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              6 months
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Days Remaining</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              120 days
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ViewInternshipDuration;