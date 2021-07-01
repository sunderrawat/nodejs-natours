const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

//create a tour schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: [true, 'A tour name is unique'],
      trim: true,
      minLength: [10, 'minimum 10 character'],
      maxLength: [50, 'maximum 50 character'],
      // validate: [validator.isAlpha, 'tour name only contains alphabets']
    },
    price: {
      type: Number,
      required: ['true', 'A tour must be a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only point to the current doc on new document creation
          return val <= this.price;
        },
        message: 'discount ({VALUE}) must be lower than its price',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'minimum rating is 1'],
      max: [5, 'maximum rating is 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'tour must have a max group size'],
    },
    duration: {
      type: Number,
      required: [true, 'tour must have a duration time'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a defficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty is either easy, medium or difficult',
      },
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
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
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

// tourSchema.pre('save', async function (next) {
//   const guidesPromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise);

//   next();
// });

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

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log('time for post ', Date.now() - this.start, ' milliseconds');
  next();
});

//aggregation middelware
tourSchema.pre('aggregate', function (next) {
  // console.log(this.pipeline());
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

//define a tour model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
