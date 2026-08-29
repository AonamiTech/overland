
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BellIcon, CheckIcon, ShieldIcon, CheckCircleIcon, AlertTriangleIcon, InfoIcon } from './InsuranceIcons';

interface Notification {
  id: number;
  type: string;
  message: string;
  time: string;
  read: boolean;
  urgent?: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  showNotifications: boolean;
  onToggle: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  unreadCount,
  showNotifications,
  onToggle
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'policy': return <ShieldIcon className="w-4 h-4 text-blue-500" />;
      case 'payment': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangleIcon className="w-4 h-4 text-red-500" />;
      default: return <InfoIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-2 relative"
        onClick={onToggle}
      >
        <BellIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">All</Badge>
              <Badge variant="outline" className="text-xs">Payments</Badge>
              <Badge variant="outline" className="text-xs">Warnings</Badge>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-3 border-b hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notif.type)}
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500">{notif.time}</p>
                  </div>
                  {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t">
            <Button variant="ghost" size="sm" className="w-full text-blue-600">
              <CheckIcon className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
