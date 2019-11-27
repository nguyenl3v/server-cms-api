const mongoose = require("mongoose");
const footerSchema = new mongoose.Schema({
  width: {
    type: String
  },
  heading: {
    type: String
  },
  logo: {
    type: String
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model("footer", footerSchema);
