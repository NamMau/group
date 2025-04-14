const Message = require('../models/message.model');
const { createNotification } = require('../services/notification.service');
const messageService = require('../services/message.service');
const { getIO } = require('../config/socket');
const User = require('../models/user.model');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    // Validate required fields
    if (!content || !receiverId) {
      return res.status(400).json({ 
        message: "Both receiverId and content are required" 
      });
    }

    const message = await messageService.createMessage(senderId, receiverId, content);

    // Emit message through Socket.IO
    const io = getIO();
    io.to(`user_${receiverId}`).emit('receive_message', {
      message,
      sender: senderId
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
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

exports.getMessagesByTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { limit = 5 } = req.query;

    const messages = await messageService.getMessagesByTutor(tutorId, limit);

    return res.status(200).json({
      success: true,
      data: messages.map(msg => ({
        _id: msg._id,
        content: msg.content,
        sender: msg.sender,
        receiver: msg.receiver,
        createdAt: msg.createdAt,
        isRead: msg.isRead
      }))
    });

  } catch (error) {
    console.error('Error in getMessagesByTutor controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};
