const mongoose = require("mongoose");
const categoriesShema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("categories", categoriesShema);
