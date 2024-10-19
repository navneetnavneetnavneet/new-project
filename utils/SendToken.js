module.exports.sendToken = (user, statusCode, res) => {
  const token = user.generatejwttoken();

  const options = {
    expire: new Date(
      Date.now() + 24 * 60 * 60 * 1000 + process.env.COOKIE_EXPIRE
    ),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      id: user._id,
      token,
      name: user.name,
      pic: user.pic,
      email: user.email,
    });
};
