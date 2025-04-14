// const Notification = require('../models/notification.model');

const Notification = require('../models/notification.model');
const mongoose = require('mongoose');

const createNotification = async (userId, message) => {
  try {
      const notification = await Notification.create({
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
    const notifications = await Notification.find({ user: userId })
      .populate('user', 'fullName avatar')
      .sort({ createdAt: -1 });
    return notifications;
  } catch (err) {
    console.error('Error fetching notifications:', err);
    throw new Error('Error fetching notifications');
  }
};

// Mark a notification as read
const markAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId, 
      { isRead: true }, 
      { new: true }
    ).populate('user', 'fullName avatar');
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
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
