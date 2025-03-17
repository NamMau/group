const Notification = require('../models/notification.model');

exports.createNotification = async (userId, message) => {
  try {
    const notification = new Notification({ user: userId, message });
    await notification.save();
    // Optionally trigger real-time socket.io events if needed
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
