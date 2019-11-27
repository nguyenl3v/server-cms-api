const express = require("express");
const Product = require("../model/product");
const mkdirp = require("mkdirp");
const fs = require("fs-extra");
const router = express.Router();

let images = [];

router.get("/", function(req, res) {
  Product.find({}, function(err, product) {
    res.status(200).json(product);
  });
});

router.post("/upload", async function(req, res) {
  if (typeof req.files !== "object") {
    return res.status(400).json({ msg: "image is empty" });
  }
  const imageFile = req.files.file;
  const id = Date.now();
  await mkdirp("public/upload/product/" + id, function(err) {
    if (err) console.log(err);
  });
  if (imageFile.length > 0) {
    for (var i = 0; i < imageFile.length; i++) {
      const image = imageFile[i].name;
      const path = "public/upload/product/" + id + "/" + image;
      imageFile[i].mv(path, function(err) {
        if (err) console.log(err);
      });
        images.push(id + "/" + image);
    }
  } else {
    const image = imageFile.name;
    const path = "public/upload/product/" + id + "/" + image;
    imageFile.mv(path, function(err) {
      if (err) console.log(err);
    });
    images.push(id + "/" + image);
  }
});

router.post("/add", function(req, res) {
  const { name, price, priceSale, description, color, size, categories } = req.body;
  priceSale > 0 ? priceSale : 0;
  if (!name || !price || !description || !color || !size || !categories) {
    res.status(400).json({ msg: "fields all is empty" });
  } else {
    const product = new Product({
      name,
      price,
      priceSale,
      description,
      image: images,
      color,
      size,
      categories
    });
    product.save();
    images = [];
    res.status(201).json({ msg: "add product success" });
  }
});

router.post("/edit", function(req, res) {
  const { name, price, priceSale, description, color, size, urlFile, categories, id } = req.body;
  priceSale > 0 ? priceSale : 0;
  Product.findById(id, function(err, p) {
    const path = "public/upload/product/" + urlFile;
    name.length > 0 ? (p.name = name) : p.name;
    price > 0 ? (p.price = price) : p.price;
    priceSale > 0 ? (p.priceSale = priceSale) : p.priceSale;
    description.length > 0 ? (p.description = description) : p.description;
    color.length > 0 ? (p.color = color) : p.color;
    size.length > 0 ? (p.size = size) : p.size;
    categories.length > 0 ? (p.categories = categories) : p.categories;
    images.length > 0 ? (p.image = images) : p.image;
    p.save(function(err) {
      if (err) {
        res.status(400).json({ msg: err });
      } else {
        if (images.length > 0) {
          fs.remove(path, function(err) {
            if (err) console.log(err);
          });
          images = [];
        }
        res.status(201).json({ msg: "edit product success" });
      }
    });
  });
});

router.get("/delete/:id/:file", function(req, res) {
  const path = "public/upload/product/" + req.params.file;
  Product.findByIdAndDelete(req.params.id, function(err, p) {
    p.save(function(err) {
      if (err) {
        res.status(400).json({ msg: err });
      } else {
        fs.remove(path, function(err) {
          if (err) console.log(err);
        });
        return res.status(200).json({ msg: "delete product success" });
      }
    });
  });
});
module.exports = router;
