const router = require("express").Router();
const protectRoute = require("../middlewares/protectRoute");
const User = require("../models/User.model");
const mongoose = require("mongoose");

router.post("/", async (req, res, next) => {
  console.log("req payload", req.payload);
  const user = await User.findById(req.payload.id).select("-password");
  res.status(200).json(user);
});

module.exports = router;
