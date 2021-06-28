const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'sucess',
    statusCode: 201,
    user: newUser,
  });
});
