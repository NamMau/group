const appointmentService = require('../services/appointment.service');
const { catchAsync } = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

class AppointmentController {
  createAppointment = catchAsync(async (req, res, next) => {
    const appointment = await appointmentService.createAppointment(req.body);
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: appointment,
    });
  });

  getAppointmentsByStudent = catchAsync(async (req, res, next) => {
    const { studentId } = req.params;
    const appointments = await appointmentService.getAppointmentsByStudent(studentId);
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: appointments,
    });
  });

  getAppointmentsByTutor = catchAsync(async (req, res, next) => {
    const { tutorId } = req.params;
    const appointments = await appointmentService.getAppointmentsByTutor(tutorId);
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: appointments,
    });
  });

  getAppointmentById = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;
    const appointment = await appointmentService.getAppointmentById(appointmentId);
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: appointment,
    });
  });

  updateAppointmentStatus = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status'));
    }

    const appointment = await appointmentService.updateAppointmentStatus(appointmentId, status);
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: appointment,
    });
  });

  deleteAppointment = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;
    await appointmentService.deleteAppointment(appointmentId);
    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      data: null,
    });
  });
}

module.exports = new AppointmentController(); 