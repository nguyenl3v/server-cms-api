const express = require("express");
const Blog = require("../model/blog");
const fs = require("fs-extra");
const mkdirp = require("mkdirp");
const router = express.Router();

let images = [];

router.get("/", function(req, res) {
  Blog.find({}, function(err, blog) {
    res.status(200).json(blog);
  });
});

router.post("/upload", function(req, res) {
  if (typeof req.files !== "object") {
    res.status(404).json({ msg: "image is not defiend" });
  } else {
    const id = Date.now();
    mkdirp("public/upload/blog/" + id, function(err) {
      if (err) console.log(err);
    });
    const imageFile = req.files.file;
    const image = imageFile.name;
    const path = "public/upload/blog/" + id + "/" + image;
    imageFile.mv(path, function(err) {
      if (err) console.log(err);
    });
    images.push(id + "/" + image);
  }
});

router.post("/add", function(req, res) {
  const { heading, description } = req.body;
  if (!heading || !description) {
    res.status(404).json({ msg: "field all is required" });
  } else {
    let blog = new Blog({
      heading,
      description,
      image: images.toString()
    });
    blog.save();
    images = [];
    res.status(201).json({ msg: "add blog successs" });
  }
});

router.post("/edit", function(req, res) {
  const { heading, description, urlFile, id } = req.body;
  const path = "public/upload/blog/" + urlFile;
  Blog.findById({ _id: id }, function(err, blog) {
    heading.length > 0 ? (blog.heading = heading) : blog.heading;
    description.length > 0
      ? (blog.description = description)
      : blog.description;
    images.toString().length > 0
      ? (blog.image = images.toString())
      : blog.image;
    blog.save(function(err) {
      if (err) res.status(400).json({ msg: err });
      if (images.toString().length > 0) {
        fs.remove(path, function(err) {
          if (err) console.log(err);
        });
        images = [];
      }
      res.status(201).json({ msg: "edit blog success" });
    });
  });
});

router.get("/delete/:id/:urlFlile", function(req, res) {
  const path = "public/upload/blog/" + req.params.urlFile;
  Blog.findByIdAndDelete({ _id: req.params.id }, function(err, blog) {
    blog.save(function(err) {
      if (err) {
        res.status(400).json({ msg: err });
      } else {
        fs.remove(path, function(err) {
          if (err) console.log(err);
        });
        res.status(200).json({ msg: "delete item blog success" });
      }
    });
  });
});

module.exports = router;
