const Tour = require('./../model/tourModel');

//Route handelr functions
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

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
