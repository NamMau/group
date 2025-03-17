const User = require('../models/user.model');
const adminService = require('../services/admin.service');
const { isAdmin } = require('../middlewares/auth');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Example for system reports
exports.getSystemReport = async (req, res) => {
  try {
    // Example: fetch number of messages, number of meetings, etc.
    // Then compile into a report object
    // ...
    res.json({
      totalUsers: 100,
      totalStudents: 80,
      totalTutors: 15,
      totalAdmins: 5,
      messagesThisWeek: 123,
      meetingsThisWeek: 12,
      studentsWithoutTutor: 5,
      // ...
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware to check admin access
exports.checkAdminAccess = isAdmin;

exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignTutorToStudent = async (req, res) => {
    try {
        const { studentId, tutorId } = req.body;
        const result = await adminService.assignTutorToStudent(studentId, tutorId);
        res.json(result);
    } catch (error) {
        if (error.message === 'Student not found.' || error.message === 'Tutor not found.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.bulkAssignTutors = async (req, res) => {
    try {
        const { assignments } = req.body;
        const result = await adminService.bulkAssignTutors(assignments);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.reassignTutor = async (req, res) => {
    try {
        const { studentId, newTutorId } = req.body;
        const result = await adminService.reassignTutor(studentId, newTutorId);
        res.json(result);
    } catch (error) {
        if (error.message === 'Student not found.' || error.message === 'New tutor not found.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.getUnassignedStudents = async (req, res) => {
    try {
        const students = await adminService.getUnassignedStudents();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTutorWorkload = async (req, res) => {
    try {
        const workload = await adminService.getTutorWorkload();
        res.json(workload);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSystemSettings = async (req, res) => {
    try {
        const result = await adminService.updateSystemSettings(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.generateReport = async (req, res) => {
    try {
        const { reportType } = req.params;
        const report = await adminService.generateReports(reportType, req.query);
        res.json(report);
    } catch (error) {
        if (error.message === 'Invalid report type.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};
