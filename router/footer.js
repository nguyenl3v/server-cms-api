const express = require("express");
const Footer = require("../model/footer");
const fs = require("fs-extra");
const mkdirp = require("mkdirp");
const router = express.Router();

let images = [];

router.get("/", function(req, res) {
  Footer.find({}, function(err, f) {
    res.status(200).json(f);
  });
});

router.post("/upload", function(req, res) {
  if (typeof req.files !== "object") {
    res.status(404).json({ msg: "image is not defiend" });
  } else {
    const id = Date.now();
    mkdirp("public/upload/footer/" + id, function(err) {
      if (err) console.log(err);
    });
    const imageFile = req.files.file;
    const image = imageFile.name;
    const path = "public/upload/footer/" + id + "/" + image;
    imageFile.mv(path, function(err) {
      if (err) console.log(err);
    });
    images.push(id + "/" + image);
    res.status(201).json({ msg: "upload images success" });
  }
});

router.post("/add", function(req, res) {
  const { heading, width, description } = req.body;
  const footer = new Footer({
    heading,
    logo: images.toString(),
    width,
    description
  });
  footer.save();
  images = [];
  res.status(201).json({ msg: "add footer success" });
});

router.post("/edit", function(req, res) {
  const { heading, width, description, urlFile, id } = req.body;
  const path = "public/upload/footer/" + urlFile;
  Footer.findById({ _id: id }, function(err, f) {
    heading.length > 0 ? (f.heading = heading) : f.heading;
    images.toString().length > 0 ? (f.logo = images.toString()) : f.logo;
    width.length > 0 ? (f.width = width) : f.width;
    description.length > 0 ? (f.description = description) : f.description;
    f.save(function(err) {
      if (err) res.status(400).json({ msg: err });
      if (images.toString().length > 0) {
        fs.remove(path, function(err) {
          if (err) console.log(err);
        });
        images = [];
      }
      res.status(201).json({ msg: "edit footer success" });
    });
  });
});

router.get("/delete/:id/:urlFlile", function(req, res) {
  const path = "public/upload/footer/" + req.params.urlFlile;
  Footer.findByIdAndDelete({ _id: req.params.id }, function(err, f) {
    f.save(function(err) {
      if (err) {
        res.status(400).json({ msg: err });
      } else {
        fs.remove(path, function(err) {
          if (err) console.log(err);
        });
        res.status(200).json({ msg: "delete item footer success" });
      }
    });
  });
});

module.exports = router;
