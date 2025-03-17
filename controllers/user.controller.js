const userService = require('../services/user.service');
const { isAdmin } = require('../middlewares/auth');

// Profile management
exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await userService.updateUser(req.user._id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user._id, currentPassword, newPassword);
    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    if (error.message === 'Current password is incorrect.') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.updateNotificationPreferences = async (req, res) => {
  try {
    const preferences = await userService.updateNotificationPreferences(req.user._id, req.body);
    if (!preferences) {
      return res.status(404).json({ message: 'User preferences not found.' });
    }
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin routes
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await userService.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await userService.getAllTutors();
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.updateUser(userId, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await userService.deleteUser(userId);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found.') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.activateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.activateUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User activated successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.deactivateUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User deactivated successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User preferences
exports.getUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await userService.getUserPreferences(userId);
    if (!preferences) {
      return res.status(404).json({ message: 'User preferences not found.' });
    }
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await userService.updateUserPreferences(userId, req.body);
    if (!preferences) {
      return res.status(404).json({ message: 'User preferences not found.' });
    }
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User dashboard
exports.getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    const dashboard = await userService.getUserDashboard(userId);
    if (!dashboard) {
      return res.status(404).json({ message: 'User dashboard not found.' });
    }
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Example of bulk assignment of tutors to students
exports.assignTutorBulk = async (req, res) => {
  try {
    // body: { tutorId, studentIds: [] }
    const { tutorId, studentIds } = req.body;
    const result = await userService.assignTutorBulk(tutorId, studentIds);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await userService.getUsersByRole(role);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    const user = await userService.updateUserStatus(userId, isActive);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await userService.searchUsers(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
