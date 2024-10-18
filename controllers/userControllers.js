const { catchAsyncError } = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/userModel");
const { sendToken } = require("../utils/SendToken");

module.exports.registerUser = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("All fileds must be required !", 500));
  }

  const alreadyExisted = await User.findOne({ email });

  if (alreadyExisted) {
    return next(
      new ErrorHandler(
        "User already exists with this email address, Please login !",
        500
      )
    );
  }

  const user = await User.create({ name, email, password, pic });
  if (!user) {
    return next(new ErrorHandler("User not created !", 500));
  }

  sendToken(user, 201, res);
});

module.exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email or Password is required !", 500));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ErrorHandler("User not found with this email address !", 404)
    );
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Wrong creadintials !", 404));
  }

  sendToken(user, 200, res);
});
