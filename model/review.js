const mongoose = require("mongoose");

const reviewShema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  evaluate: {
    type: String,
    required: true
  },
  idProduct: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("reviews", reviewShema);
