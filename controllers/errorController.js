const sendProdError = (err, res) => {
  if (!err.isOperational) {
    console.error('ERROR 💥 💥', err);
    res.status(500).json({
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
    sendProdError(err, res);
  }
};
