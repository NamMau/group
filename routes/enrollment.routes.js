const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment.controller');
const { auth, isTutorOrAdmin, isOwnerOrAdmin } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(auth);

// Enrollment management
router.post('/', enrollmentController.createEnrollment);
router.get('/', enrollmentController.getEnrollments);
router.get('/:enrollmentId', enrollmentController.getEnrollmentById);
router.put('/:enrollmentId', isOwnerOrAdmin, enrollmentController.updateEnrollment);
router.delete('/:enrollmentId', isOwnerOrAdmin, enrollmentController.deleteEnrollment);

// Enrollment status
router.put('/:enrollmentId/status', isOwnerOrAdmin, enrollmentController.updateEnrollmentStatus);
router.get('/:enrollmentId/progress', enrollmentController.getEnrollmentProgress);

// Course access
router.get('/:enrollmentId/course', enrollmentController.getEnrolledCourse);
router.get('/:enrollmentId/classes', enrollmentController.getEnrolledClasses);

// Payment management
router.post('/:enrollmentId/payment', enrollmentController.processPayment);
router.get('/:enrollmentId/payment-history', enrollmentController.getPaymentHistory);

// Student performance
router.get('/:enrollmentId/performance', enrollmentController.getStudentPerformance);
router.get('/:enrollmentId/attendance', enrollmentController.getAttendanceRecord);

module.exports = router;
