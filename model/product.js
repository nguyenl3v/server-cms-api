const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String
  },
  price: {
    type: Number
  },
  priceSale: {
    type: Number,
    default: 0
  },
  categories: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: Array
  },
  color: {
    type: Array
  },
  size: {
    type: Array
  }
});

module.exports = mongoose.model("product", productSchema);
