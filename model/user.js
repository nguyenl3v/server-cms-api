const mongoose = require('mongoose');

const userSChema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:Date.now
    }
});
module.exports = mongoose.model('user',userSChema);