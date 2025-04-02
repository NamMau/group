const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

const authenticate = async (req, res, next) => {
  try {
    // Check if there are any admins in the system
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0 && req.path === '/register-admin' && req.method === 'POST') {
      return next(); // go through to register admin
    }

    // Check token admin in db?
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
    console.error("Authentication error:", error.message);
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
  if (!['tutor', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied. Tutor or Admin only.' });
  }
  next();
};

const isOwnerOrAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
    return res.status(403).json({ message: 'Access denied. Owner or Admin only.' });
  }
  next();
};

module.exports = {
  authenticate,
  isAdmin,
  isTutor,
  isStudent,
  isTutorOrAdmin,
  isOwnerOrAdmin
};
