const Review = require('./../model/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
  //allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const getAllReviews = await Review.find();
  const sameUserReview = getAllReviews.filter((review) => {
    return review.tour == req.body.tour && review.user.id == req.body.user;
  });
  if (sameUserReview.length > 0) {
    return next(
      new AppError('You are already provide review on this tour', 208)
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    review,
  });
});

exports.getAllReview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: reviews,
  });
});

exports.getOneReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: review,
  });
});

exports.updateReview = factory.updateOne(Review);
exports.deleteOneReview = factory.deleteOne(Review);
