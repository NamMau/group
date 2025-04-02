const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, isAdmin, isOwnerOrAdmin } = require('../middlewares/auth');

// Apply auth middleware to all routes
// router.use(authenticate);

// User profile routes
router.get('/getalluser', authenticate, userController.getProfile);
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.put('/notification-preferences', userController.updateNotificationPreferences);

// Admin routes
router.get('/', isAdmin, userController.getAllUsers);
router.get('/get-students', authenticate, userController.getAllStudents);
router.get('/get-tutors', authenticate, userController.getAllTutors);
router.get('/:userId', authenticate, isAdmin, userController.getUserById);
router.put('/update-user/:userId', authenticate, isAdmin, userController.updateUser);
router.delete('/delete-user/:userId', authenticate, isAdmin, userController.deleteUser);
router.post('/:userId/activate', isAdmin, userController.activateUser);
router.post('/:userId/deactivate', isAdmin, userController.deactivateUser);

// User preferences
router.get('/:userId/preferences', isOwnerOrAdmin, userController.getUserPreferences);
router.put('/:userId/preferences', isOwnerOrAdmin, userController.updateUserPreferences);

// User dashboard
router.get('/:userId/dashboard', authenticate, userController.getUserDashboard);


// Student dashboard routes
router.get('/students/:id/study-time', authenticate, userController.getStudyTime);
router.get('/students/:id/progress', authenticate, userController.getProgress);
router.get('/students/:id/courses', authenticate, userController.getEnrolledCourses); 

module.exports = router;
