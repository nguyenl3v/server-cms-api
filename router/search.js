const express = require("express");
const Product = require("../model/product");
const router = express.Router();

router.get("/", function(req, res) {
  let { q } = req.query;
  q.length === 0 ? (q = "empty") : q;
  Product.find({}, function(err, product) {
    const p = product.filter(
      item => item.name.toLowerCase().indexOf(q.trim().toLowerCase()) !== -1
    );
    res.status(200).json(p);
  });
});

module.exports = router;
