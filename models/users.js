const mongoose = require('mongoose')
const plm = require('passport-local-mongoose');

require('../db');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username must be unique"]
  },
  displayName: {
    type: String,
    default: 'newUser'
  },
  contact: String,
  image: {
    type: String,
    default: '/images/user-default.jpg'
  },
  about:{
    type: String,
    default: 'Add something about you'
  },
  chattedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  socketId:{
    type: String,
    default: ''
  }
})

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);