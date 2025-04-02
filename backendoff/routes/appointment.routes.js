const express = require('express');
const appointmentController = require('../controllers/appointment.controller');
const { authenticate } = require('../middlewares/auth');
const checkRole = require('../middlewares/role');

const router = express.Router();

// Apply authentication middleware to all routes
// router.use(authenticate);

// Student routes
router.get('/get-student/:studentId', 
  authenticate, checkRole('student', 'admin'),
  appointmentController.getAppointmentsByStudent
);
router.post('/create-appointment', 
  authenticate, checkRole('student', 'admin'),
  appointmentController.createAppointment
);
router.delete('/delete-appointment/:appointmentId', 
  authenticate, checkRole('student', 'admin'),
  appointmentController.deleteAppointment
);

// Tutor routes
router.get('/tutor/:tutorId', 
  authenticate, checkRole('tutor', 'admin'),
  appointmentController.getAppointmentsByTutor
);
router.get('/:appointmentId', 
  checkRole('student', 'tutor', 'admin'),
  appointmentController.getAppointmentById
);
router.patch('/:appointmentId/status', 
  checkRole('tutor', 'admin'),
  appointmentController.updateAppointmentStatus
);

module.exports = router; 