const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('no document find with this id', 404));
    }
    res.status(204).json({
      status: 'success',
      message: 'document deleted successfully',
      data: null,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('no document find with this id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    
    const query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('no document find with this id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //execute query
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitedFields()
      .paginate();
    const doc = await features.queryModel;

    //send response
    res.status(200).json({
      status: 'success',
      result: doc.length,
      requestTime: req.requestTime,
      data: {
        doc,
      },
    });
  });
