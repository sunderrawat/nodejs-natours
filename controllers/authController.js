const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
    if (!user || !await user.correctPassword(password, user.password)){
    return next(new AppError('Incorrect email or password', 401));
  }

  //if everything is ok then send token to client
  const token = genrateToken(user._id);
  res.status(200).json({
    status: 'sucess',
    token
  });
});
