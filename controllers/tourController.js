const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//Route handelr functions

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
  const findOneTour = tours.find((el) => el.id === +req.params.id);
  if (!findOneTour) {
    return res.status(404).json({ status: 'fail', message: 'Invallid id' });
  }
  res.status(200).json({
    status: 'success',
    data: { tour: findOneTour },
  });
};

exports.updateTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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
