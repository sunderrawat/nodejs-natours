const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

//middelware
// global middelware
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('hello from middelware..');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

const text = 'hello write file from txt';
fs.writeFileSync(`${__dirname}/dev-data/data/newfile.txt`, text);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//Route handelr functions

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    requestTime: req.requestTime,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  //   console.log(req.params);
  const findOneTour = tours.find((el) => el.id === +req.params.id);
  if (!findOneTour) {
    return res.status(404).json({ status: 'fail', message: 'Invallid id' });
  }
  res.status(200).json({
    status: 'success',
    data: { tour: findOneTour },
  });
};

const updateTour = (req, res) => {
  //   console.log(req.params);
  const findOneTour = tours.find((el) => el.id === +req.params.id);
  if (!findOneTour) {
    return res.status(404).json({ status: 'fail', message: 'Invallid id' });
  }
  res.status(200).json({
    status: 'success',
    message: 'updating tour...',
  });
};

const deleteTour = (req, res) => {
  //   console.log(req.params);
  const findOneTour = tours.find((el) => el.id === +req.params.id);
  if (!findOneTour) {
    return res.status(404).json({ status: 'fail', message: 'Invallid id' });
  }
  res.status(204).json({
    status: 'success',
    message: 'tour deleted',
    data: null,
  });
};

const createTour = (req, res) => {
  //   const addTour = tours.push(req.body);
  //   fs.writeFileSync(
  //     `${__dirname}/dev-data/data/tours-simple.json`,
  //     JSON.stringify(tours)
  //   );

  //   res.status(201).json({
  //     status: 'success',
  //     result: tours.length,
  //     data: {
  //       tours,
  //     },
  //   });
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(req.body, { id: newId });
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    }
  );
};

//users route handeler
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'route not yet defined',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'route not yet defined',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'route not yet defined',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'route not yet defined',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'route not yet defined',
  });
};

//Routes
//mounting routes
const tourRouter = express.Router();
const userRouter = express.Router();
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//tour routes
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

//user routes
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = app;
