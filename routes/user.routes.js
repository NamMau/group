const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth, isAdmin, isOwnerOrAdmin } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(auth);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.put('/notification-preferences', userController.updateNotificationPreferences);

// Admin routes
router.get('/', isAdmin, userController.getAllUsers);
router.get('/students', isAdmin, userController.getAllStudents);
router.get('/tutors', isAdmin, userController.getAllTutors);
router.get('/:userId', isAdmin, userController.getUserById);
router.put('/:userId', isAdmin, userController.updateUser);
router.delete('/:userId', isAdmin, userController.deleteUser);
router.post('/:userId/activate', isAdmin, userController.activateUser);
router.post('/:userId/deactivate', isAdmin, userController.deactivateUser);

// User preferences
router.get('/:userId/preferences', isOwnerOrAdmin, userController.getUserPreferences);
router.put('/:userId/preferences', isOwnerOrAdmin, userController.updateUserPreferences);

// User dashboard
router.get('/:userId/dashboard', isOwnerOrAdmin, userController.getUserDashboard);

module.exports = router;
