const Notification = require('../models/notification.model');

const createNotification = async (userId, message) => {
  try {
      const notification = await NotificationModel.create({
          user: userId,
          message: message,
          createdAt: new Date(),
          isRead: false,
      });
      return notification;
  } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error("Failed to create notification");
  }
};  

// Fetch all notifications for a specific user
const fetchNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    return notifications;
  } catch (err) {
    throw new Error('Error fetching notifications');
  }
};

// Mark a notification as read
const markAsRead = async (notificationId) => {
  try {
      const notification = await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
      return notification;
  } catch (error) {
      console.error("Error marking notification as read:", error);
      throw new Error("Failed to mark notification as read");
  }
};

module.exports = {
  createNotification,
  fetchNotifications,
  markAsRead,
};
