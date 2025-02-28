import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import NotificationDetail from '../../components/Notifications/NotificationDetail';
import api from '../../services/api';

const NotificationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotification();
  }, [id]);

  const fetchNotification = async () => {
    try {
      const response = await api.get(`/api/notifications/${id}/`);
      setNotification(response.data);
    } catch (error) {
      console.error('Error fetching notification:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          'Failed to load notification';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await api.post(`/api/notifications/${id}/read/`);
      setNotification(prev => ({
        ...prev,
        is_read: true
      }));
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="text-emerald-600 hover:text-emerald-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Notifications
        </button>
      </div>

      {/* Notification Detail */}
      {notification && (
        <NotificationDetail
          notification={notification}
          onClose={handleClose}
          onMarkAsRead={!notification.is_read ? handleMarkAsRead : undefined}
        />
      )}

      {/* Related Notifications */}
      {notification?.related_notifications?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Related Notifications
          </h3>
          <div className="space-y-4">
            {notification.related_notifications.map(relatedNotification => (
              <div
                key={relatedNotification.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <h4 className="text-sm font-medium text-gray-900">
                  {relatedNotification.title}
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  {relatedNotification.message}
                </p>
                <button
                  onClick={() => navigate(`/notifications/${relatedNotification.id}`)}
                  className="mt-2 text-sm text-emerald-600 hover:text-emerald-700"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDetailPage; 