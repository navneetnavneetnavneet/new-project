const { catchAsyncError } = require("../middlewares/catchAsyncError");

module.exports.homepage = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ message: "route working" });
});
