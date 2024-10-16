module.exports.catchAsyncError = (func) => (req, res, next) => {
  return Promise.resolve(func(req, res, next)).catch(next);
};
