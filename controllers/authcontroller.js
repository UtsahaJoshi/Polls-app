const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const signInToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signInToken(newUser._id);
  console.log(global);

  res.status(201).json({
    status: "success",
    token,
    data: {
      newUser,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email or password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const token = signInToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  //1 getting token check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);

  if (!token) {
    return next(
      new AppError("You are not logged in please login to get access", 401)
    );
  }
  //2 Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3 check if user exist

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("The user belong to this token does no longer exist", 401)
    );
  }
  //4 check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed the password! please login again",
        401
      )
    );
  }

  //grant access to the next route
  req.user = freshUser;
  next();
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("This email is not registered in our database", 404)
    );
  }
  //generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to users email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}`;
  const message = `<h1 style="color:red;">Forgot your password?</h1> <p style="color:blue;">Click reset button to reset your password otherwise ignore this email</p>
    <a href="${resetUrl}" method="post" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">Reset Password</a>`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 15 min)",
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: true });
    return next(
      new AppError("There are error sending a email. Try again later!", 500)
    );
  }

  res.status(200).json({
    status: "success",
    message: "Token send to email",
  });
});
exports.resetPassword = (req, res, next) => {};
