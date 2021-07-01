const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//middelware
// global middelware

// set security http header
app.use(helmet());

//set node enviorment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//set request limit
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 100,
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

app.use('/api', apiLimiter);

//use body parser for reading body data
app.use(express.json());

//serving static files
app.use(express.static(`${__dirname}/public`));

//Data sanitize against NoSQL query
app.use(mongoSanitize());

//Data sanitize against xss
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'ratingsQuantity',
      'ratingsAverage',
      'price',
      'difficulty',
    ],
  })
);

//Routes
//mounting routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//handling unhandeled routes
app.all('*', (req, res, next) => {
  next(new AppError(`can't find this ${req.originalUrl} on this server!`, 404));
});

//handling errors

app.use(globalErrorHandler);

module.exports = app;
