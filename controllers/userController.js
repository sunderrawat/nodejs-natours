const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

//users route handeler
exports.getAllUsers =  catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    users
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'route not yet defined',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'route not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'route not yet defined',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1 create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword',
        400
      )
    );
  }

  //2 update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next)=>{
  await User.findByIdAndUpdate(req.user.id, {active: false})

  res.status(204).json({
    status: 'success'
  })
})

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'route not yet defined',
  });
};
