const express = require("express");
const Categories = require("../model/categories");
const router = express.Router();

router.get("/", function(req, res) {
  Categories.find({}, function(err, cate) {
    res.status(200).json(cate);
  });
});

router.post("/add", function(req, res) {
  const { name, slug } = req.body;
  if (!name || !slug) {
    res.status(400).json({ msg: "name is required" });
  } else {
    const categories = new Categories({
      name,
      slug
    });
    categories.save();
    res.status(201).json({ msg: "add categories success" });
  }
});

router.post("/edit", function(req, res) {
  const { name, slug, id } = req.body;
  if (!name || !slug || !id) {
    res.status(400).json({ msg: "name and slug is required" });
  } else {
    Categories.findById(id, function(err, cate) {
      cate.name = name;
      cate.slug = slug;
      cate.save();
      res.status(201).json({ msg: "edit caregories success" });
    });
  }
});

router.get("/delete/:id", function(req, res) {
  Categories.findByIdAndDelete(req.params.id, function(err, cate) {
    cate.save();
    res.status(200).json({ msg: "delete menu item success" });
  });
});

module.exports = router;
