const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");

router.get("/:name", async (req, res, next) => {
  const oneAttendee = await User.findOne({ name: req.params.name });
  console.log(oneAttendee);
  res.status(200).json(oneAttendee);
});

module.exports = router;
