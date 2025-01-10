import React from 'react';

const NotificationCenter = ({ notifications }) => {
  return (
    <div className="notification-center">
      <h2>Notifications</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id}>
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationCenter; 