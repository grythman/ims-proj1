import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Bell, Mail, MessageSquare, Calendar, CheckSquare } from 'lucide-react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import api from '../../services/api';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    report_notifications: true,
    task_notifications: true,
    meeting_notifications: true,
    message_notifications: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/notifications/settings/');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      toast.error('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/notifications/settings/', settings);
      toast.success('Notification settings saved successfully');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const notificationTypes = [
    {
      key: 'email_notifications',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: <Mail className="h-5 w-5 text-gray-400" />
    },
    {
      key: 'push_notifications',
      label: 'Push Notifications',
      description: 'Receive notifications in browser',
      icon: <Bell className="h-5 w-5 text-gray-400" />
    },
    {
      key: 'report_notifications',
      label: 'Report Updates',
      description: 'Get notified about report submissions and reviews',
      icon: <CheckSquare className="h-5 w-5 text-gray-400" />
    },
    {
      key: 'task_notifications',
      label: 'Task Updates',
      description: 'Get notified about task assignments and deadlines',
      icon: <Calendar className="h-5 w-5 text-gray-400" />
    },
    {
      key: 'message_notifications',
      label: 'Messages',
      description: 'Get notified about new messages',
      icon: <MessageSquare className="h-5 w-5 text-gray-400" />
    }
  ];

  return (
    <Card className="divide-y divide-gray-200">
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900">
          Notification Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage how you receive notifications
        </p>
      </div>

      <div className="px-6 py-4 space-y-6">
        {notificationTypes.map(({ key, label, description, icon }) => (
          <div key={key} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={key}
                type="checkbox"
                checked={settings[key]}
                onChange={() => handleToggle(key)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 flex items-center">
              {icon}
              <div className="ml-3">
                <label htmlFor={key} className="font-medium text-gray-700">
                  {label}
                </label>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-50">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NotificationSettings; 