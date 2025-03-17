module.exports = function (requiredRoles) {
    return (req, res, next) => {
      const { role } = req.user; // from the auth middleware
      if (!requiredRoles.includes(role)) {
        return res.status(403).json({ message: 'Access denied.' });
      }
      next();
    };
  };
  