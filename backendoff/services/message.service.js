const Message = require('../models/message.model');
const User = require('../models/user.model');
const { sendEmail } = require('./email.service');

class MessageService {
    async sendMessage(messageData) {
        // Validate sender and recipient
        const [sender, recipient] = await Promise.all([
            User.findById(messageData.sender),
            User.findById(messageData.recipient)
        ]);

        if (!sender || !recipient) {
            throw new Error('Sender or recipient not found.');
        }

        // Create message
        const message = new Message(messageData);
        await message.save();

        // Send email notification if enabled
        if (recipient.preferences.messageNotifications) {
            await sendEmail({
                to: recipient.email,
                subject: 'New Message',
                text: `You have received a new message from ${sender.fullName}`
            });
        }

        return message;
    }

    async createMessage(senderId, receiverId, content) {
        // Kiểm tra sender và recipient
        const [sender, recipient] = await Promise.all([
          User.findById(senderId),
          User.findById(receiverId)
        ]);
      
        if (!sender || !recipient) {
          throw new Error('Sender or recipient not found.');
        }
      
        const messageData = { sender: senderId, recipient: receiverId, content };
        const message = new Message(messageData);
        await message.save();
      
        // (Nếu cần gửi thông báo/email...)
        return message;
      }

    async getConversation(userId, otherUserId) {
        return await Message.find({
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId }
            ]
        })
        .populate('sender', 'fullName email')
        .populate('recipient', 'fullName email')
        .sort({ createdAt: 1 });
    }

    async getUnreadMessages(userId) {
        return await Message.find({
            recipient: userId,
            isRead: false
        })
        .populate('sender', 'fullName email')
        .sort({ createdAt: -1 });
    }

    async markAsRead(messageId, userId) {
        const message = await Message.findOneAndUpdate(
            {
                _id: messageId,
                recipient: userId,
                isRead: false
            },
            { isRead: true },
            { new: true }
        );

        if (!message) {
            throw new Error('Message not found or already read.');
        }

        return message;
    }

    async deleteMessage(messageId, userId) {
        const message = await Message.findOneAndDelete({
            _id: messageId,
            $or: [
                { sender: userId },
                { recipient: userId }
            ]
        });

        if (!message) {
            throw new Error('Message not found or unauthorized.');
        }

        return message;
    }

    async getMessageThreads(userId) {
        // Get all unique conversations
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { recipient: userId }
            ]
        })
        .populate('sender', 'fullName email')
        .populate('recipient', 'fullName email')
        .sort({ createdAt: -1 });

        // Group messages by conversation
        const threads = {};
        messages.forEach(message => {
            const otherUserId = message.sender._id.toString() === userId 
                ? message.recipient._id.toString()
                : message.sender._id.toString();

            if (!threads[otherUserId]) {
                threads[otherUserId] = {
                    user: message.sender._id.toString() === userId 
                        ? message.recipient 
                        : message.sender,
                    lastMessage: message,
                    unreadCount: message.recipient._id.toString() === userId && !message.isRead ? 1 : 0
                };
            } else if (!message.isRead && message.recipient._id.toString() === userId) {
                threads[otherUserId].unreadCount++;
            }
        });

        return Object.values(threads);
    }

    async getMessagesByTutor(tutorId, limit = 5) {
        try {
            // Validate tutor exists and is actually a tutor
            const tutor = await User.findOne({ _id: tutorId, role: 'tutor' });
            if (!tutor) {
                throw new Error('Tutor not found');
            }

            // Get messages where tutor is either sender or recipient
            const messages = await Message.find({
                $or: [
                    { sender: tutorId },
                    { recipient: tutorId }
                ]
            })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .populate('sender', 'fullName email')
            .populate('recipient', 'fullName email');

            return messages;
        } catch (error) {
            console.error('Error in message service - getMessagesByTutor:', error);
            throw error;
        }
    }
}

module.exports = new MessageService(); 