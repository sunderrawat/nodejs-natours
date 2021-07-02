const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  )
  .get(reviewController.getAllReview);

router
  .route('/:id')
  .patch(authController.protect, reviewController.updateReview)
  .delete(reviewController.deleteOneReview);
module.exports = router;
