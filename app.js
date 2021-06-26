const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//middelware
// global middelware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));
app.use(express.json());

//Routes
//mounting routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//handling unhandeled routes
app.all('*', (req, res, next) => {
  next(new AppError(`can't find this ${req.originalUrl} on this server!`, 404));
});

//handling errors

app.use(globalErrorHandler);

module.exports = app;
