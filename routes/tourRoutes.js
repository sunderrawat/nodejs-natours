const express = require('express');

const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

router
  .route('/top-5-tours')
  .get(tourController.aliasTopTour, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/get-monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect ,tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide') ,tourController.deleteTour);

  //POST /tour/458sadf/reviews
  //GET /tour/4785jljl/reviews
  //GET /tour/7895euiv/reviews/7845ljau
  
router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview)

module.exports = router;
