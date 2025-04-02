const catchAsync = (fn) => {
  return function (req, res, next) {
    Promise.resolve(fn.call(this, req, res, next)).catch(next);
  };
};

module.exports = { catchAsync }; 