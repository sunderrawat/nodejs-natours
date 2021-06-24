const { query } = require('express');
const { findByIdAndDelete } = require('./../model/tourModel');
const Tour = require('./../model/tourModel');

//Route handelr functions
exports.getAllTours = async (req, res) => {
  try {
    // const tours = await Tour.find();
    //query filltering
    // console.log(req.query);\
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj);

    // const tours = await Tour.find({duration: 5, difficulty: 'easy'});
    // const tours = await Tour.find({duration: {$lte: 5}});
    // const tours = await Tour.find(req.query);

    //advanced filltering
    //localhost:3000/api/v1/tours?duration[lte]=5&difficulty=easy
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (el) => `$${el}`);

    const query = Tour.find(JSON.parse(queryStr));
    const tours = await query;
    // const tours = await Tour.find()
    //   .where('duration')
    //   .lte(10)
    //   .where('difficulty')
    //   .equals('easy');

    res.status(200).json({
      status: 'success',
      result: tours.length,
      requestTime: req.requestTime,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  //   console.log(req.params);
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: 'tour deleted',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
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
