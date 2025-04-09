const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { authenticate, isTutorOrAdmin, isOwnerOrAdmin, isAdmin } = require('../middlewares/auth');

// Apply auth middleware to all routes
// router.use(authenticate);

// Course management
// Thêm endpoint enroll multiple students
router.post('/:courseId/enroll-bulk', authenticate, isAdmin, courseController.bulkEnrollStudents);
router.post('/create-course', authenticate, isAdmin, courseController.createCourse);
router.get('/get-courses',  authenticate,courseController.getCourses);
router.get('/:courseId', courseController.getCourseById);
router.put('/update-course/:courseId', authenticate, isOwnerOrAdmin, courseController.updateCourse);
router.delete('/delete-course:courseId', authenticate, isOwnerOrAdmin, courseController.deleteCourse);

router.get("/:userId/courses", courseController.getUserCourses);
 
// Class management
// router.post('/:courseId/classes', isTutorOrAdmin, courseController.createClass);
// router.get('/:courseId/classes', courseController.getClassesByCourse);
// router.get('/:courseId/classes/:classId', courseController.getClassById);
// router.put('/:courseId/classes/:classId', isOwnerOrAdmin, courseController.updateClass);
// router.delete('/:courseId/classes/:classId', isOwnerOrAdmin, courseController.deleteClass);

// Dashboard
router.get('/student-dashboard/:studentId', authenticate, courseController.getStudentDashboard);
router.get('/tutor-dashboard/:tutorId', authenticate, courseController.getTutorDashboard);

// New route for getting courses by tutor
router.get('/coursebytutor/:tutorId', authenticate, courseController.getCoursesByTutor); // New route

// Course enrollment
router.post('/enroll/:courseId', authenticate, courseController.enrollInCourse);
router.post('/:courseId/unenroll', courseController.unenrollFromCourse);
router.get('/:courseId/enrollments', isOwnerOrAdmin, courseController.getCourseEnrollments);
router.get('/getcoursebyname/:name', authenticate, courseController.getCourseByName);

module.exports = router;
