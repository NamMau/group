const socketIO = require('socket.io');

let io;

const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    // Middleware để xác thực người dùng
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

        // Tham gia vào room của user
        socket.join(`user_${socket.user.userId}`);

        // Xử lý tin nhắn
        socket.on('send_message', async (data) => {
            try {
                const { receiverId, content } = data;
                // Lưu tin nhắn vào database
                const message = await Message.create({
                    sender: socket.user.userId,
                    receiver: receiverId,
                    content
                });

                // Gửi tin nhắn đến người nhận
                io.to(`user_${receiverId}`).emit('receive_message', {
                    message,
                    sender: socket.user.userId
                });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        // Xử lý meeting
        socket.on('join_meeting', async (meetingId) => {
            try {
                // Kiểm tra quyền tham gia meeting
                const meeting = await Meeting.findById(meetingId);
                if (!meeting) {
                    socket.emit('error', { message: 'Meeting not found' });
                    return;
                }

                // Tham gia vào room của meeting
                socket.join(`meeting_${meetingId}`);

                // Thông báo cho các thành viên khác
                socket.to(`meeting_${meetingId}`).emit('user_joined', {
                    userId: socket.user.userId,
                    timestamp: new Date()
                });
            } catch (error) {
                console.error('Error joining meeting:', error);
            }
        });

        socket.on('leave_meeting', (meetingId) => {
            socket.leave(`meeting_${meetingId}`);
            socket.to(`meeting_${meetingId}`).emit('user_left', {
                userId: socket.user.userId,
                timestamp: new Date()
            });
        });

        // Xử lý typing status
        socket.on('typing', (data) => {
            const { receiverId, isTyping } = data;
            io.to(`user_${receiverId}`).emit('user_typing', {
                userId: socket.user.userId,
                isTyping
            });
        });

        // Xử lý online status
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user.userId);
            // Cập nhật trạng thái offline cho user
            io.emit('user_offline', { userId: socket.user.userId });
        });
    });

    return io;
};

module.exports = {
    initializeSocket,
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
}; 