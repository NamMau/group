const Appointment = require('../models/appointment.model');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

class AppointmentService {
  // async createAppointment(appointmentData) {
  //   const appointment = await Appointment.create(appointmentData);
  //   return appointment;
  // }
  async createAppointment(appointmentData) {
    const appointment = await Appointment.create(appointmentData);
    const fullAppointment = await Appointment.findById(appointment._id)
      .populate("tutor", "fullName")
      .populate("student", "fullName");
    return fullAppointment;
  }  

  async getAppointmentsByStudent(studentId) {
    const appointments = await Appointment.find({ student: studentId })
      .populate('tutor', 'fullName email')
      .sort({ date: 1, startTime: 1 });
    return appointments;
  }

  async getAppointmentsByTutor(tutorId) {
    const appointments = await Appointment.find({ tutor: tutorId })
      .populate('student', 'fullName email')
      .sort({ date: 1, startTime: 1 });
    return appointments;
  }

  async getAppointmentById(appointmentId) {
    const appointment = await Appointment.findById(appointmentId)
      .populate('tutor', 'fullName email')
      .populate('student', 'fullName email');
    
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