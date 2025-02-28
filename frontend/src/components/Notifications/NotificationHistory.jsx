import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Bell, Filter, Search, Trash2, CheckCircle } from 'lucide-react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import api from '../../services/api';

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, [page, typeFilter]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications/history/', {
        params: {
          page,
          type: typeFilter !== 'all' ? typeFilter : undefined,
          search: searchTerm || undefined
        }
      });
      setNotifications(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notification history');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchNotifications();
  };

  const handleDelete = async (ids) => {
    try {
      await api.post('/api/notifications/delete/', { ids });
      toast.success('Notifications deleted successfully');
      setSelectedNotifications([]);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notifications:', error);
      toast.error('Failed to delete notifications');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedNotifications(notifications.map(n => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedNotifications(prev => {
      if (prev.includes(id)) {
        return prev.filter(nId => nId !== id);
      }
      return [...prev, id];
    });
  };

  const getNotificationIcon = (type) => {
    const iconClasses = "h-5 w-5";
    switch (type) {
      case 'application':
        return <Bell className={`${iconClasses} text-blue-500`} />;
      case 'report':
        return <Bell className={`${iconClasses} text-green-500`} />;
      case 'task':
        return <Bell className={`${iconClasses} text-yellow-500`} />;
      case 'message':
        return <Bell className={`${iconClasses} text-purple-500`} />;
      default:
        return <Bell className={`${iconClasses} text-gray-500`} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <Card>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Notification History
          </h3>
          {selectedNotifications.length > 0 && (
            <Button
              onClick={() => handleDelete(selectedNotifications)}
              variant="danger"
              className="mt-2 sm:mt-0 inline-flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedNotifications.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="sm:w-48">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="application">Applications</option>
                <option value="report">Reports</option>
                <option value="task">Tasks</option>
                <option value="message">Messages</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No notifications found
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  checked={selectedNotifications.length === notifications.length}
                  onChange={handleSelectAll}
                />
                <span className="ml-2 text-sm text-gray-500">
                  Select All
                </span>
              </div>
            </div>

            {/* Notifications */}
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                  !notification.is_read ? 'bg-emerald-50' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelect(notification.id)}
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getNotificationIcon(notification.notification_type)}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="text-xs text-gray-400">
                          {format(new Date(notification.created_at), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default NotificationHistory; 