const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.match(/^https?:\/\/\w+/),
      message: 'Picture address should be a valid link',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
