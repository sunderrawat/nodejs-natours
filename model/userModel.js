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
      return iatJwt > changedTimeStamp;
  }

  //return false means not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
