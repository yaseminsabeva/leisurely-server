const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");

router.get("/:id", async (req, res, next) => {
  const oneAttendee = await User.findById({ _id: req.params.id });
  console.log(oneAttendee);
  res.status(200).json(oneAttendee);
});

module.exports = router;
