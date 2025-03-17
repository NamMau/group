const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

const auth = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

const isTutor = (req, res, next) => {
  if (req.user.role !== 'tutor') {
    return res.status(403).json({ message: 'Access denied. Tutor only.' });
  }
  next();
};

const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Student only.' });
  }
  next();
};

const isTutorOrAdmin = (req, res, next) => {
  if (req.user.role !== 'tutor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Tutor or admin only.' });
  }
  next();
};

const isOwnerOrAdmin = (req, res, next) => {
  const resourceId = req.params.userId || req.params.courseId || req.params.meetingId;
  if (req.user.role !== 'admin' && req.user._id.toString() !== resourceId) {
    return res.status(403).json({ message: 'Access denied. Owner or admin only.' });
  }
  next();
};

module.exports = {
  auth,
  isAdmin,
  isTutor,
  isStudent,
  isTutorOrAdmin,
  isOwnerOrAdmin
};
