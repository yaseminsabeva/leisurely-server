const router = require("express").Router();
const mongoose = require("mongoose");
const Event = require("../models/Event.model");

router.post("/home", async (req, res, next) => {
  const { title } = req.body;
  console.log(title);
  const eventsList = await Event.find({
    title: { $regex: title, $options: "i" },
  });
  console.log(eventsList);
  //res.status(200).json(user);
});

module.exports = router;
