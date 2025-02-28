import React from 'react';
import { Bell } from 'lucide-react';
import NotificationSettings from '../../components/Notifications/NotificationSettings';

const NotificationsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Notification Preferences
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your notification settings and preferences
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Bell className="h-8 w-8 text-gray-400" />
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow">
        <NotificationSettings />
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Bell className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              About Notifications
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Notifications help you stay updated with important events:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Application status changes</li>
                <li>Report submissions and reviews</li>
                <li>Task assignments and deadlines</li>
                <li>Messages from mentors and students</li>
                <li>System announcements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 