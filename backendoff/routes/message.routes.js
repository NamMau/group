const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { authenticate  } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(authenticate );

// Message management
router.post('/send-message/:userId', messageController.sendMessage);
router.get('/conversation/:userId', messageController.getConversation);

router.put('/markasread/:messageId/read', messageController.markAsRead);
router.delete('/delete/:messageId', messageController.deleteMessage);
router.get('/threads', messageController.getMessageThreads);
router.get('/get-unread', messageController.getUnreadMessages);
router.get('/get-messages-by-tutor/:tutorId', messageController.getMessagesByTutor);

module.exports = router;
