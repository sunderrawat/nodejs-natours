const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//Route handelr functions
exports.checkBody = (req, res, next) => {
//   if (!(req.body.hasOwnProperty('name') || req.body.hasOwnProperty('price'))) {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'name and price property not given by you',
    });
  }

  next();
};

exports.checkId = (req, res, next, val) => {
  //   console.log(`your id is ${val}`);
  const findOneTour = tours.find((el) => el.id === +val);
  if (!findOneTour) {
    return res.status(404).json({ status: 'fail', message: 'Invallid id' });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    requestTime: req.requestTime,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  //   console.log(req.params);
  res.status(200).json({
    status: 'success',
    data: { tour: findOneTour },
  });
};

exports.updateTour = (req, res) => {
  //   console.log(req.params);
  res.status(200).json({
    status: 'success',
    message: 'updating tour...',
  });
};

exports.deleteTour = (req, res) => {
  //   console.log(req.params);

  res.status(204).json({
    status: 'success',
    message: 'tour deleted',
    data: null,
  });
};

exports.createTour = (req, res) => {
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
