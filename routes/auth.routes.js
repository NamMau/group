const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { auth, isAdmin } = require('../middlewares/auth');

// Public routes
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected routes
router.post('/logout', auth, authController.logout);
router.post('/logout-all', auth, authController.logoutAll);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.put('/change-password', auth, authController.changePassword);
router.put('/notification-preferences', auth, authController.updateNotificationPreferences);

// Admin only routes
router.post('/register/student', auth, isAdmin, authController.registerStudent);
router.post('/register/tutor', auth, isAdmin, authController.registerTutor);

module.exports = router;
