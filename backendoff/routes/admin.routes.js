const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth');

// Apply authentication and admin authorization to all routes
router.use(authenticate);

// Dashboard statistics
router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/message-statistics', adminController.getMessageStatistics);
router.get('/exception-reports', adminController.getExceptionReports);

// Take user
router.get('/get-all-user', adminController.getAllUsers);
// Dashboard
router.get('/dashboard-for-admin', adminController.getDashboardStats);

// Tutor assignment
router.post('/assign-tutor', adminController.assignTutorToStudent);
router.post('/bulk-assign-tutors', adminController.bulkAssignTutors);
router.put('/reassign-tutor', adminController.reassignTutor);

// Student management
router.get('/unassigned-students', adminController.getUnassignedStudents);

// Tutor management
router.get('/tutor-workload', adminController.getTutorWorkload);

// System settings
router.put('/settings', adminController.updateSystemSettings);

// Reports
router.get('/reports/:reportType', adminController.generateReport);

module.exports = router;
