const express = require("express");
const Menu = require("../model/menu");
const router = express.Router();

router.get("/", async function(req, res) {
  const menu = await Menu.find();
  res.status(200).json(menu);
});

router.post("/add", function(req, res) {
  const { title, link } = req.body;
  if (!title || !link) {
    res.status(400).json({ msg: "fields all is required" });
  } else {
    Menu.findOne({ title: title }, function(err, menu) {
      if (menu) {
        res.status(400).json({ msg: "title is already" });
      } else {
        const menu = new Menu({
          title,
          link
        });
        menu.save();
        res.status(201).json({ msg: "add menu success" });
      }
    });
  }
});

router.post("/edit", function(req, res) {
  const { title, link, id } = req.body;
  if (!title || !link || !id) {
    res.status(400).json({ msg: "fields all is required" });
  } else {
    Menu.findById(id, function(err, menu) {
      if (menu.title === title || menu.link === link) {
        res.status(400).json({ msg: "title or link is already" });
      } else {
        menu.title = title;
        menu.link = link;
        menu.save();
        res.status(201).json({ msg: "edit menu success" });
      }
    });
  }
});

router.get("/delete/:id", function(req, res) {
  Menu.findByIdAndDelete(req.params.id, function(err, menu) {
    menu.save();
    res.status(200).json({ msg: "delete menu success" });
  });
});

module.exports = router;
