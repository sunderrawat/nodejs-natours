const Tour = require('./../model/tourModel')

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

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    // result: tours.length,
    requestTime: req.requestTime,
    data: {
      // tours,
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
  res.status(201).json({
    status: 'success',
    // data: newTour,
  });
};
