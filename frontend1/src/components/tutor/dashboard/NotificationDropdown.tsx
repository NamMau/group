import { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { notificationService } from "../../../services/notificationService"; // Import đúng tên


interface AppNotification {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  message: string;
  createdAt: string;
  isRead: boolean;
}

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotificationsData = async () => {
      try {
        const fetchedNotifications = await notificationService.fetchNotifications(); // Should return Notification[]
        setNotifications(fetchedNotifications);
        setError(null);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch notifications");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationsData();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchNotificationsData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mark notifications as read
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Icon */}
      <div className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <FaBell className="text-gray-700 text-xl hover:text-orange-600 transition duration-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
          {/* Header */}
          <h3 className="text-orange-700 font-serif text-lg font-semibold">Notifications</h3>
          <hr className="my-2 border-t border-gray-300" />

          {/* Notification List */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-4">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition ${
                    !notification.isRead ? 'bg-orange-50' : ''
                  }`}
                  onClick={() => markAsRead(notification._id)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                    {notification.user.avatar && (
                      <img
                        src={notification.user.avatar}
                        alt={notification.user.fullName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{notification.user.fullName}</p>
                    <p className="text-gray-600 text-sm truncate">{notification.message}</p>
                  </div>

                  {/* Time */}
                  <p className="text-gray-500 text-xs">{formatTime(notification.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
