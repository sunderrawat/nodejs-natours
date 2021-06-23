const mongoose = require('mongoose');
//create a tour schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ['true', 'A tour must have a name'],
    unique: ['true', 'A tour name is unique'],
  },
  price: {
    type: Number,
    required: ['true', 'A tour must be a price'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

//define a tour model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;