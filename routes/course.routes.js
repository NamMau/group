const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { auth, isTutorOrAdmin, isOwnerOrAdmin } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(auth);

// Course management
router.post('/', isTutorOrAdmin, courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/:courseId', courseController.getCourseById);
router.put('/:courseId', isOwnerOrAdmin, courseController.updateCourse);
router.delete('/:courseId', isOwnerOrAdmin, courseController.deleteCourse);

// Class management
router.post('/:courseId/classes', isTutorOrAdmin, courseController.createClass);
router.get('/:courseId/classes', courseController.getClassesByCourse);
router.get('/:courseId/classes/:classId', courseController.getClassById);
router.put('/:courseId/classes/:classId', isOwnerOrAdmin, courseController.updateClass);
router.delete('/:courseId/classes/:classId', isOwnerOrAdmin, courseController.deleteClass);

// Dashboard
router.get('/student/:studentId/dashboard', courseController.getStudentDashboard);
router.get('/tutor/:tutorId/dashboard', courseController.getTutorDashboard);

// Course enrollment
router.post('/:courseId/enroll', courseController.enrollInCourse);
router.post('/:courseId/unenroll', courseController.unenrollFromCourse);
router.get('/:courseId/enrollments', isOwnerOrAdmin, courseController.getCourseEnrollments);

module.exports = router;
