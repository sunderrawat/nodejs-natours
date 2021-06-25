const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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
  res.status(404).json({
    status: 'fail',
    message: `can't find this ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
