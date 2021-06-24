const mongoose = require('mongoose');
//create a tour schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ['true', 'A tour must have a name'],
    unique: ['true', 'A tour name is unique'],
    trim: true,
  },
  price: {
    type: Number,
    required: ['true', 'A tour must be a price'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: Number,
  maxGroupSize: Number,
  duration: Number,
  difficulty: String,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a image cover'],
  },
  images: [String],
  startDates: [Date],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//define a tour model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
