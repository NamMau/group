const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const messageRoutes = require('./message.routes');
const meetingRoutes = require('./meetings.routes');
const documentRoutes = require('./document.routes');
const blogRoutes = require('./blog.routes');
const courseRoutes = require('./course.routes');
const enrollmentRoutes = require('./enrollment.routes');
const adminRoutes = require('./admin.routes');

// API Version 1
router.use('/v1/auth', authRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/courses', courseRoutes);
router.use('/v1/meetings', meetingRoutes);
router.use('/v1/messages', messageRoutes);
router.use('/v1/documents', documentRoutes);
router.use('/v1/blog', blogRoutes);
router.use('/v1/admin', adminRoutes);
router.use('/v1/enrollments', enrollmentRoutes);

// API Version 2 (for future use)
// router.use('/v2/auth', authRoutes);
// router.use('/v2/users', userRoutes);
// router.use('/v2/courses', courseRoutes);
// router.use('/v2/meetings', meetingRoutes);
// router.use('/v2/messages', messageRoutes);
// router.use('/v2/documents', documentRoutes);
// router.use('/v2/blog', blogRoutes);
// router.use('/v2/admin', adminRoutes);
// router.use('/v2/enrollments', enrollmentRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
