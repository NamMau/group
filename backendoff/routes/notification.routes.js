const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

router.post("/create", notificationController.createNotification);

module.exports = router;
