const notificationService = require('../services/notification.service');
const mongoose = require('mongoose');

const createNotification = async (req, res) => {
    try {
        const { userId, message } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ message: "User ID and message are required." });
        }

        const notification = await notificationService.createNotification(userId, message);
        res.status(201).json({ message: "Notification created successfully", notification });
    } catch (error) {
        res.status(500).json({ message: "Error creating notification", error: error.message });
    }
};


// Fetch notifications for a user
const fetchNotifications = async (req, res) => {
    try {
      const notifications = await notificationService.fetchNotifications(req.user._id);
      res.status(200).json({ success: true, data: notifications });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
};
  
  // Mark a notification as read
const markAsRead = async (req, res) => {
    try {
      const { notificationId } = req.body; // Expecting notification ID from request body
  
      const notification = await notificationService.markAsRead(notificationId);
      res.status(200).json({ success: true, data: notification });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
};
  
module.exports = {
    createNotification,
    fetchNotifications,
    markAsRead,
};