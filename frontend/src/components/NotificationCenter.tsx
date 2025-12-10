import { useCRM } from './CRMContext';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function NotificationCenter() {
  const { currentUser, notifications, markNotificationRead } = useCRM();

  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'task': return CheckCircle;
      case 'ticket': return AlertCircle;
      default: return Info;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Notifications</h1>
        <p className="text-gray-600 mt-2">{unreadCount} unread notifications</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {userNotifications.map(notification => {
            const Icon = getIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => !notification.read && markNotificationRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <Icon className={`w-6 h-6 ${!notification.read ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{notification.title}</h3>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <div className="text-gray-500">{new Date(notification.createdAt).toLocaleString()}</div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </div>
              </div>
            );
          })}

          {userNotifications.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
