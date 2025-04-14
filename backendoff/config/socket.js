const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/message.model');
const Meeting = require('../models/meeting.model');

let io;

const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    //Middleware to authenticate socket connection
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.user.userId);

        socket.join(`user_${socket.user.userId}`);

        socket.on('send_message', async (data) => {
            try {
                const { receiverId, content } = data;
                const message = await Message.create({
                    sender: socket.user.userId,
                    receiver: receiverId,
                    content
                });

                io.to(`user_${receiverId}`).emit('receive_message', {
                    message,
                    sender: socket.user.userId
                });
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('join_meeting', async (meetingId) => {
            try {
                const meeting = await Meeting.findById(meetingId);
                if (!meeting) {
                    socket.emit('error', { message: 'Meeting not found' });
                    return;
                }

                socket.join(`meeting_${meetingId}`);
                io.to(`meeting_${meetingId}`).emit('user_joined', {
                    userId: socket.user.userId,
                    timestamp: new Date()
                });
            } catch (error) {
                console.error('Error joining meeting:', error);
                socket.emit('error', { message: 'Failed to join meeting' });
            }
        });

        socket.on('leave_meeting', (meetingId) => {
            socket.leave(`meeting_${meetingId}`);
            io.to(`meeting_${meetingId}`).emit('user_left', {
                userId: socket.user.userId,
                timestamp: new Date()
            });
        });

        socket.on('typing', (data) => {
            const { receiverId, isTyping } = data;
            io.to(`user_${receiverId}`).emit('user_typing', {
                userId: socket.user.userId,
                isTyping
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user.userId);
            io.emit('user_offline', { userId: socket.user.userId });
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIO
}; 