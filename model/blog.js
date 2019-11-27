const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
  heading: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("blog", blogSchema);
