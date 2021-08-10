const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const pug = require('pug');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//middelware
// global middelware
app.use(cookieParser());
// set security http header
// app.use(helmet());

// app.use((req,res, next)=>{
//   console.log(req.originalUrl)
//   console.log(req.originalUrl.startsWith('/api'));
//   next();
// })

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
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

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

//views routes or client side routes
app.use('/', viewRouter);

//api routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//handling unhandeled routes
app.all('*', (req, res, next) => {
  next(new AppError(`can't find this ${req.originalUrl} on this server!`, 404));
});

//handling errors

app.use(globalErrorHandler);

module.exports = app;
