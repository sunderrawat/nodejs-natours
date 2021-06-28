const mongoose = require('mongoose');
const validator = require('validator');

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
      validator: function (val) {
        return val === this.password;
      },
      message: 'password not matched',
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
