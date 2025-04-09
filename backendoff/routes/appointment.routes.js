const express = require('express');
const appointmentController = require('../controllers/appointment.controller');
const { authenticate } = require('../middlewares/auth');
const checkRole = require('../middlewares/role');

const router = express.Router();

// Apply authentication middleware to all routes
// router.use(authenticate);

// Student routes
router.get('/get-student/:studentId', 
  authenticate,
  appointmentController.getAppointmentsByStudent
);
router.post('/create-appointment', 
  authenticate,
  appointmentController.createAppointment
);
router.delete('/delete-appointment/:appointmentId', 
  authenticate,
  appointmentController.deleteAppointment
);

// Tutor routes
router.get('/tutor/:tutorId', 
  authenticate,
  appointmentController.getAppointmentsByTutor
);
router.get('/:appointmentId', 
  authenticate,
  appointmentController.getAppointmentById
);
router.patch('/:appointmentId/status', 
  authenticate,
  appointmentController.updateAppointmentStatus
);

module.exports = router; 