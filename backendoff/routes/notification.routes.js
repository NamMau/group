const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const notificationService = require("../services/notification.service");
const { authenticate, isAdmin, isTutor } = require('../middlewares/auth');

router.post("/create", authenticate, notificationController.createNotification);

// Fetch notifications for the authenticated user
router.get('/', authenticate, notificationController.fetchNotifications);

// Mark a notification as read
router.post('/mark-read', authenticate, notificationController.markAsRead);

module.exports = router;
