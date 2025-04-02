const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status-codes');

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Access denied. Insufficient permissions.'));
    }

    next();
  };
};

module.exports = checkRole; 