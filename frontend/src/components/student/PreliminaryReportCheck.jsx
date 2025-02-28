import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '../UI/Card';

const PreliminaryReportCheck = () => {
  const checkItems = [
    {
      title: 'Word Count',
      status: 'success',
      message: 'Meets minimum requirement (2000/1500 words)',
      icon: CheckCircle
    },
    {
      title: 'Plagiarism Check',
      status: 'success', 
      message: 'Original content (2% similarity)',
      icon: CheckCircle
    },
    {
      title: 'Required Sections',
      status: 'warning',
      message: 'Missing conclusion section',
      icon: AlertCircle
    },
    {
      title: 'Citations',
      status: 'error',
      message: 'No citations found in report',
      icon: XCircle
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Preliminary Report Check
        </h3>
        <div className="space-y-4">
          {checkItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <item.icon 
                className={`h-5 w-5 mt-0.5 ${getStatusColor(item.status)}`}
              />
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className={`text-sm ${getStatusColor(item.status)}`}>
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Please address the highlighted issues before submitting your final report.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PreliminaryReportCheck;