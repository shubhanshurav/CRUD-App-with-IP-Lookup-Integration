// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  city: {
    type: String,
  },

  region: {
    type: String,
  },

  country: {
    type: String,
  },

  weather: {
    type: Object,
  },
});

module.exports = mongoose.model("User", userSchema);
