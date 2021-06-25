const mongoose = require('mongoose');
const slugify = require('slugify');

//create a tour schema
const tourSchema = new mongoose.Schema(
  {
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
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    maxGroupSize: Number,
    duration: Number,
    difficulty: {
      type: String,
      required: [true, 'A tour must have a defficulty'],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
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
      select: false,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtuals
tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

//document pre middelware before .save() and .create()
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('saving the document...');
//   console.log(this);
//   next();
// });

// //after saving document this middelware run
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//query middelware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  // this.find({ ratingsAverage: { $eq: 4.5 } });
  // console.log(this)
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (doc, next) {
  console.log('time for post ', Date.now() - this.start, ' milliseconds');
  next();
});

//define a tour model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
