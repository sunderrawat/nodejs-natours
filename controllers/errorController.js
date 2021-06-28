const AppError = require('./../utils/appError');
const handleCastErrDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrDB = (err) => {
  const message = `Duplicate field value / ${err.keyValue.name} / please use another`;
  return new AppError(message, 400);
};
const handleValidarionErrDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleInvalidSigJwt = (err) => {
  return new AppError('Invalid token, Login again', 401);
};
const handleTokenExpireJwt = (err) => {
  return new AppError('Token Expired, Login again', 401);
};

const sendProdError = (err, res) => {
  if (!err.isOperational) {
    console.error('ERROR 💥 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!! 😧',
    });
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrDB(error);
    if (error.code === 11000) error = handleDuplicateErrDB(error);
    if (err.name === 'ValidationError') error = handleValidarionErrDB(error);
    if (err.name === 'JsonWebTokenError') error = handleInvalidSigJwt(error);
    if (err.name === 'TokenExpiredError') error = handleTokenExpireJwt(error);

    sendProdError(error, res);
  }
};
