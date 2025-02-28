import React from 'react';
import { format } from 'date-fns';
import { Bell, FileText, User, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

const NotificationDetail = ({ notification, onClose, onMarkAsRead }) => {
  const getNotificationIcon = (type) => {
    const iconClasses = "h-6 w-6";
    switch (type) {
      case 'application':
        return <FileText className={`${iconClasses} text-blue-500`} />;
      case 'report':
        return <CheckCircle className={`${iconClasses} text-green-500`} />;
      case 'task':
        return <Calendar className={`${iconClasses} text-yellow-500`} />;
      case 'message':
        return <MessageSquare className={`${iconClasses} text-purple-500`} />;
      default:
        return <Bell className={`${iconClasses} text-gray-500`} />;
    }
  };

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'application':
        return 'Application Update';
      case 'report':
        return 'Report Notification';
      case 'task':
        return 'Task Update';
      case 'message':
        return 'New Message';
      default:
        return 'System Notification';
    }
  };

  const getActionButton = (type, data) => {
    switch (type) {
      case 'application':
        return (
          <Button
            as="a"
            href={`/applications/${data?.id}`}
            className="mt-4 w-full"
          >
            View Application
          </Button>
        );
      case 'report':
        return (
          <Button
            as="a"
            href={`/reports/${data?.id}`}
            className="mt-4 w-full"
          >
            View Report
          </Button>
        );
      case 'task':
        return (
          <Button
            as="a"
            href={`/tasks/${data?.id}`}
            className="mt-4 w-full"
          >
            View Task
          </Button>
        );
      case 'message':
        return (
          <Button
            as="a"
            href={`/messages/${data?.id}`}
            className="mt-4 w-full"
          >
            View Message
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getNotificationIcon(notification.notification_type)}
            <h3 className="text-lg font-medium text-gray-900">
              {getNotificationTypeLabel(notification.notification_type)}
            </h3>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ×
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <h4 className="text-base font-medium text-gray-900">
              {notification.title}
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              {notification.message}
            </p>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Received</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(notification.created_at), 'PPpp')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {notification.is_read ? (
                    <span className="text-green-600">Read</span>
                  ) : (
                    <span className="text-yellow-600">Unread</span>
                  )}
                </dd>
              </div>
              {notification.sender && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">From</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-1" />
                      {notification.sender}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Related Data */}
          {notification.related_data && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Related Information</h4>
              <div className="mt-2 bg-gray-50 rounded-md p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(notification.related_data, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Action Button */}
          {getActionButton(notification.notification_type, notification.related_data)}

          {/* Mark as Read Button */}
          {!notification.is_read && onMarkAsRead && (
            <Button
              onClick={onMarkAsRead}
              variant="outline"
              className="mt-4 w-full"
            >
              Mark as Read
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NotificationDetail; 