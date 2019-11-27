const express = require("express");
const SlideShow = require("../model/slideshow");
const router = express.Router();
const mkdirp = require("mkdirp");
const fs = require("fs-extra");
let images = [];
router.get("/", function(req, res) {
  SlideShow.find({}, function(err, slide) {
    res.status(200).json(slide);
  });
});

router.post("/upload", function(req, res) {
  if (typeof req.files !== "object") {
    return res.status(400).json({ msg: "image is empty" });
  }
  const id = Date.now();
  mkdirp("public/upload/slideshow/" + id, function(err) {
    if (err) console.log(err);
  });
  const imageFile = req.files.file;
  const image = imageFile.name;
  const path = "public/upload/slideshow/" + id + "/" + image;
  imageFile.mv(path, function(err) {
    if (err) console.log(err);
  });
  images.push(id + "/" + image);
});

router.post("/add", function(req, res) {
  const { heading, title, button, buttonLink } = req.body;
  if (!images) {
    res.status(400).json({ msg: "image is empty" });
  } else {
    const slide = new SlideShow({
      heading,
      title,
      button,
      buttonLink,
      image: images.toString()
    });
    slide.save();
    images = [];
    res.status(201).json({ msg: "add slideshow success" });
  }
});

router.post("/edit", function(req, res) {
  const { heading, title, button, buttonLink, urlFile, id } = req.body;
  if (!images) {
    res.status(400).json({ msg: "image is empty" });
  } else {
    SlideShow.findById(id, function(err, slide) {
      const path = "public/upload/slideshow/" + urlFile;
      heading.length > 0 ? (slide.heading = heading) : slide.heading;
      title.length > 0 ? (slide.title = title) : slide.title;
      button.length > 0 ? (slide.button = button) : slide.button;
      buttonLink.length > 0
        ? (slide.buttonLink = buttonLink)
        : slide.buttonLink;
      images.toString().length > 0
        ? (slide.image = images.toString())
        : slide.image;
      slide.save(function(err) {
        if (images.length > 0) {
          fs.remove(path, function(err) {
            if (err) console.log(err);
          });
          images = [];
        }
        res.status(201).json({ msg: "edit slideShow success" });
      });
    });
  }
});

router.get("/delete/:id/:file", function(req, res) {
  const path = "public/upload/slideshow/" + req.params.file;
  SlideShow.findByIdAndDelete(req.params.id, function(err, slide) {
    slide.save(function(err) {
      fs.remove(path, function(err) {
        if (err) res.status(500).json({ msg: err });
      });
      return res.status(200).json({ msg: "delete slideshow success" });
    });
  });
});
module.exports = router;
