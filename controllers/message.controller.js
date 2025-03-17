const Message = require('../models/message.model');
const { createNotification } = require('../services/notification.service');
const messageService = require('../services/message.service');
const { getIO } = require('../config/socket');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    const message = await messageService.createMessage(senderId, receiverId, content);

    // Emit message through Socket.IO
    const io = getIO();
    io.to(`user_${receiverId}`).emit('receive_message', {
      message,
      sender: senderId
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const messages = await messageService.getConversation(currentUserId, userId);
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await messageService.getConversations(userId);
    res.json(conversations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUnreadMessages = async (req, res) => {
  try {
    const messages = await messageService.getUnreadMessages(req.user._id);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    const message = await messageService.markAsRead(messageId, userId);
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    await messageService.deleteMessage(messageId, userId);
    res.json({ message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMessageThreads = async (req, res) => {
  try {
    const threads = await messageService.getMessageThreads(req.user._id);
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
