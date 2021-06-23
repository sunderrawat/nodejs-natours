const express = require('express');

const tourController = require('./../controllers/tourController');

const router = express.Router();

//param middleware
router.param('id', (req, res, next, val) => {
  console.log(`your id is ${val}`);
  next();
});
router.param('id', tourController.checkId);

// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//tour routes
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
