"use client";
import { useState, useRef, useEffect } from "react";
import { FaBell, FaTrash, FaCheck } from "react-icons/fa";
import { notificationService, AppNotification } from "../../../services/notificationService"; // Import notificationService
import Image from "next/image";
import { useRouter } from "next/navigation";

const NotificationDropdown = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const fetchedNotifications = await notificationService.fetchNotifications();
        setNotifications(fetchedNotifications);
        setUnreadCount(fetchedNotifications.filter((n: AppNotification) => !n.isRead).length);
        setError(null);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch notifications");
        // Don't clear notifications on error
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
      // Don't show error to user, just log it
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  };

  const handleDelete = async (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

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
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-orange-700 font-serif text-lg font-semibold">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-gray-500 hover:text-orange-500 flex items-center"
              >
                <FaCheck className="mr-1" />
                Mark all as read
              </button>
            )}
          </div>
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
                  className={`flex items-start space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition ${
                    !notification.isRead ? 'bg-orange-50' : ''
                  }`}
                  onClick={() => {
                    if (!notification.isRead) {
                      handleMarkAsRead(notification._id);
                    }
                    if (notification.link) {
                      router.push(notification.link);
                    }
                  }}
                >
                  {/* Avatar */}
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={notification.user.avatar}
                      alt={notification.user.fullName}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 font-medium">{notification.user.fullName}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification._id);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm truncate">{notification.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{formatTime(notification.createdAt)}</p>
                  </div>
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