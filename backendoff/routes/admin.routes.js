const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Apply auth and admin middleware to all routes
router.use(authenticate);
router.use(isAdmin);



// Take user
router.get('/get-all-user', authenticate, adminController.getAllUsers);
// Dashboard
router.get('/dashboard-for-admin',isAdmin, adminController.getDashboardStats);

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
