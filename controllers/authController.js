const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  //create jwt token
  const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);

  res.status(201).json({
    status: 'sucess',
    statusCode: 201,
    token,
    user: newUser,
  });
});
