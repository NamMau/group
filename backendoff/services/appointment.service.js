const Appointment = require('../models/appointment.model');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

class AppointmentService {
  async createAppointment(appointmentData) {
    const appointment = await Appointment.create(appointmentData);
    return appointment;
  }

  async getAppointmentsByStudent(studentId) {
    const appointments = await Appointment.find({ student: studentId })
      .populate('tutor', 'name email')
      .sort({ date: 1, startTime: 1 });
    return appointments;
  }

  async getAppointmentsByTutor(tutorId) {
    const appointments = await Appointment.find({ tutor: tutorId })
      .populate('student', 'name email')
      .sort({ date: 1, startTime: 1 });
    return appointments;
  }

  async getAppointmentById(appointmentId) {
    const appointment = await Appointment.findById(appointmentId)
      .populate('tutor', 'name email')
      .populate('student', 'name email');
    
    if (!appointment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
    }
    
    return appointment;
  }

  async updateAppointmentStatus(appointmentId, status) {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
    }

    return appointment;
  }

  async deleteAppointment(appointmentId) {
    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!appointment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
    }
  }
}

module.exports = new AppointmentService(); 