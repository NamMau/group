require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./config/db');
const routes = require('./routes');
const mongoose = require('mongoose');
const http = require('http');
const { initializeSocket } = require('./config/socket');


// // Import routes
// const adminRoutes = require('./routes/admin.routes');
// const authRoutes = require('./routes/auth.routes');
// const courseRoutes = require('./routes/course.routes');
// const documentRoutes = require('./routes/document.routes');
// const meetingRoutes = require('./routes/meetings.routes');
// const messageRoutes = require('./routes/message.routes');
// const blogRoutes = require('./routes/blog.routes');
// const appointmentRoutes = require('./routes/appointment.routes');
// const userRoutes = require('./routes/user.routes');
// const enrollmentRoutes = require('./routes/enrollment.routes');


const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Security middleware
app.use(helmet());

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Nên dùng array thay vì string
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Nên dùng array thay vì string
  credentials: true,
  maxAge: 86400 // Thêm thời gian cache preflight requests (24 hours)
};

app.use(cors(corsOptions));

// Xử lý preflight request
app.options('*', cors(corsOptions));


// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Compression middleware
app.use(compression());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/documents', documentRoutes);
// app.use('/api/meeting', meetingRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/enrollments', enrollmentRoutes);
// app.use('/api/admin', adminRoutes);
app.use('/api', routes);



// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Connect to MongoDB after server starts
  connectDB()
    .then(() => {
      console.log('MongoDB Connected');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    });
});

module.exports = app;
