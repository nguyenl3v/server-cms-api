const mongoose = require("mongoose");
const orderShema = new mongoose.Schema({
  name: {
    type: String
  },
  email:{
    type:String
  },
  address:{
    type:String
  },
  city:{
    type:String
  },
  province:{
    type:String
  },
  postalCode:{
    type:Number
  },
  phone:{
    type:Number
  },
  cart:{
    type:Array
  }
});
module.exports = mongoose.model("order", orderShema);
