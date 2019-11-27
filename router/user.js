var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var User = require("../model/user");
var jwt = require("jsonwebtoken");
var auth = require("../middleware/auth");

/* GET users listing. */
router.post("/register", function(req, res) {
  const { name, email, password, password2 } = req.body;
  if (password !== password2) {
    res.status(401).json({ msg: "password do not match" });
  } else {
    User.findOne({ email: email }, function(err, user) {
      if (user) {
        res.status(400).json({ msg: "email is already" });
      } else {
        var user = new User({
          name,
          email,
          password
        });
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            user.save();
            res.status(201).json({ msg: "register success" });
          });
        });
      }
    });
  }
});

router.post("/login", function(req, res) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user.admin === false) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            _id: user._id,
            name: user.name,
            email: user.email
          };
          let token2 = jwt.sign({ payload }, "agsjhdgashjdgahjsd", {
            expiresIn: 100000
          });
          res.status(201).json(token2);
        } else {
          res.status(401).json({ msg: "email or password does not exits" });
        }
      } else {
        res.status(401).json({ msg: "user does not exits" });
      }
    })
    .catch(() => res.status(404).json({ msg: "user does not exits" }));
});
router.get("/user/customer", auth, function(req, res) {
  User.findById(req.user.payload._id)
    .select("name")
    .then(user => res.status(200).json(user));
});
module.exports = router;
