const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
// const bcrypt = require('bcryptjs');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const genrateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  //create jwt token
  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
  const token = genrateToken(newUser._id);

  res.status(201).json({
    status: 'sucess',
    statusCode: 201,
    token,
    user: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check password and email is available or not
  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }

  //verify email and password
  const user = await User.findOne({ email }).select('+password');

  // if (!user || !(await bcrypt.compare(password, user.password))) {
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //if everything is ok then send token to client
  const token = genrateToken(user._id);
  res.status(200).json({
    status: 'sucess',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1. check if token is available
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Login to app for access this content', 401));
  }

  //verify jwt token
  // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //token belongs to current user
  const currentUser = await User.findById(decoded.id);
  // console.log(currentUser);
  if (!currentUser) {
    return next(new AppError('This token belongs to user is not exist', 401));
  }

  //check if user changed password after token issued
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError('user recently changed password! please log in again', 401)
    );
  }

  //Grant access for protected routes
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not authorize for this action', 403));
    }

    next();
  };
};

//forgot password and reset it
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user found provide a valid email', 404));
  }

  //genrate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to user email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit with new password and confirmPassword to: ${resetUrl}. \n If you didn't forgot password then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Forgot Your Password for Natours',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent on your email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error during sending email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1 find user from token and check token is expired
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or expired!', 403));
  }

  //2 set user password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3 update changedPasswordAt propert for user on userModel pre fun
  //4 login and send jwt token
  const token = genrateToken(user._id);
  res.status(200).json({
    status: 'sucess',
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1 find user
  const user = await User.findById(req.user._id).select('+password');

  //2 check posted password is correct
  const checkPassword = await user.correctPassword(
    req.body.postedPassword,
    user.password
  );
  if (!checkPassword)
    return next(
      new AppError(
        'current password is not matched Try again with correct password',
        401
      )
    );

  //3 if correct then update it
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //send success response and jwt token
  const token = genrateToken(user._id);
  res.status(200).json({
    status: 'sucess',
    token,
  });
});
