const express = require("express");
const User = require("../model/user");
const router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

router.post("/register", function(req, res) {
  const { name, email, password } = req.body;
  if(!name || !email || !password){
    return res.status(401).json({msg:"field all is required"})
  }
  User.findOne({ email: email }, function(err, user) {
    if (user) {
      res.status(400).json({ msg: "email is already" });
    } else {
      var user = new User({
        name: name,
        email: email,
        password: password,
        admin: true
      });
      bcrypt.genSalt(10, function(err, password) {
        bcrypt.hash(user.password, password, function(err, hash) {
          user.password = hash;
          user.save();
          res
            .status(201)
            .json({ msg: "register" + "" + user.email + "" + "success" });
        });
      });
    }
  });
});

router.post("/login", function(req, res) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user.admin === true) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            _id: user._id,
            name: user.name,
            email: user.email
          };
          let token = jwt.sign({ payload }, "kjhgasddhjkasjhdkjnkasd", {
            expiresIn: 1440
          });
          res.status(201).json(token);
        } else {
          res.status(401).json({ msg: "email or password does not exits" });
        }
      }else{
        res.status(401).json({ msg: "user does not exits admin" });
      }
    })
    .catch(() => res.status(404).json({ msg: "email does not exits" }));
});

module.exports = router;