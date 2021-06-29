const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must have a name'],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'user must have an email address'],
    validate: [validator.isEmail, 'Email address is not valid'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  password: {
    type: String,
    required: [true, 'user must have an password'],
    minlength: [6, 'minimum 6 chars'],
    maxlength: [20, 'maximum 20 chars'],
    trim: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'user must have an confirm password'],
    validate: {
      //only works on .create() and .save()
      validator: function (val) {
        return val === this.password;
      },
      message: 'password not matched',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  //only run this function when password is modified
  if (!this.isModified('password')) return;

  //hash the password
  this.password = await bcrypt.hash(this.password, 12);

  //delete password confirm field from db
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre(/^find/, function (next) {
  //this point the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (iatJwt) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(iatJwt > changedTimeStamp);
    return iatJwt < changedTimeStamp;
  }

  //return false means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
