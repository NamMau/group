const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Public routes
router.post('/register-admin',authenticate, authController.registerAdmin);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);


// Protected routes
router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, authController.changePassword);
router.put('/notification-preferences', authenticate, authController.updateNotificationPreferences);

// Admin only routes
router.post('/register/student', authenticate, isAdmin, authController.registerStudent);
router.post('/register/tutor', authenticate, isAdmin, authController.registerTutor);

module.exports = router;
