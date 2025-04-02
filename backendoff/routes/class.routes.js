const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');
const { authenticate, isAdmin } = require('../middlewares/auth');

// router.use(authenticate);

router.post('/create-class', authenticate, isAdmin, classController.createClass);
router.put('/update-class/:classId',authenticate, isAdmin, classController.updateClass);
router.delete('/delete-class/:classId', authenticate, isAdmin, classController.deleteClass);
router.delete('/delete-all-classes', authenticate, isAdmin, classController.deleteAllClasses);


router.get('/get-all-classes', authenticate, classController.getAllClasses);
router.get('/get-class-by/:classId', authenticate, isAdmin, classController.getClassById);

router.post('/enroll-student/:classId',isAdmin, classController.addStudentToClass);
router.delete('/enroll-student/:classId',isAdmin, classController.removeStudentFromClass);


router.get('/get-classby-course/:courseId', classController.getClassesByCourse);
router.get('/get-classby-tutor/:tutorId', classController.getClassesByTutor);

router.get('/search-class', authenticate, isAdmin, classController.searchClassByClassName);

module.exports = router;
