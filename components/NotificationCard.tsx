
import React from 'react';
import { Notification, NotificationSeverity } from '../types';
import { AlertTriangle, Info, Bell } from 'lucide-react';

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const severityStyles = {
    [NotificationSeverity.DANGER]: {
      icon: <AlertTriangle className="text-status-danger" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-status-danger',
    },
    [NotificationSeverity.WARNING]: {
      icon: <Bell className="text-status-warning" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-status-warning',
    },
    [NotificationSeverity.INFO]: {
      icon: <Info className="text-brand-accent" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-brand-accent',
    },
  };

  const styles = severityStyles[notification.severity];

  return (
    <div className={`flex items-start p-4 rounded-lg border-l-4 ${styles.bgColor} ${styles.borderColor} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex-shrink-0 mr-3">
        {styles.icon}
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-neutral-black">{notification.message}</p>
        <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
