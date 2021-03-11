const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    status: "success",
    result: user.length,
    user,
  });
});
