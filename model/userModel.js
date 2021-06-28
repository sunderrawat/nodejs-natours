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

const User = mongoose.model('User', userSchema);

module.exports = User;
