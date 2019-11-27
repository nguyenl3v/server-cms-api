const express = require("express");
const Order = require("../model/order");
const router = express.Router();

router.get("/", function(req, res) {
  Order.find({}, function(err, order) {
    res.status(200).json(order);
  });
});

router.post("/", function(req, res) {
  const { name, email, address, city, province, postalCode, phone, cart } = req.body;
  if (
    !name ||
    !email ||
    !address ||
    !city ||
    !province ||
    !postalCode ||
    !phone
  ) {
    res.status(404).json({ msg: "field all is required" });
  } else {
    var order = new Order({
      name,
      email,
      address,
      city,
      province,
      postalCode,
      phone,
      cart
    });
    order.save();
    res.status(201).json({ msg: "order success" });
  }
});



module.exports = router;
