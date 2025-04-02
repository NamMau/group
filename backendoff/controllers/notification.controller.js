const notificationService = require('../services/notification.service');

exports.createNotification = async (req, res) => {
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
