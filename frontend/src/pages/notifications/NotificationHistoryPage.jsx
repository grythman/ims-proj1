import React from 'react';
import { Bell, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationHistory from '../../components/Notifications/NotificationHistory';

const NotificationHistoryPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <Link
              to="/settings/notifications"
              className="mr-4 text-emerald-600 hover:text-emerald-700"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Notification History
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View and manage your past notifications
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Bell className="h-8 w-8 text-gray-400" />
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-white rounded-lg shadow">
        <NotificationHistory />
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Bell className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Managing Your Notifications
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Tips for managing your notifications:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Use filters to find specific notifications</li>
                <li>Select multiple notifications to delete them at once</li>
                <li>Click on a notification to view more details</li>
                <li>Adjust your notification preferences in settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationHistoryPage; 