const router = require("express").Router();
const mongoose = require("mongoose");
const uploader = require("../config/cloudinary");
const isAuthenticated = require("../middlewares/jwt.middleware");
const Event = require("../models/Event.model");
const User = require("../models/User.model");

router.get("/me", isAuthenticated, async (req, res, next) => {
  //console.log("req payload", req.payload);
  const user = await User.findById(req.payload.id).select("-password");
  res.status(200).json(user);
});

router.patch(
  "/me",
  uploader.single("picture"),
  isAuthenticated,
  async (req, res, next) => {
    try {
      //const user = await User.findById(req.payload.id).select("-password");
      //res.status(200).json(user);
      const { id } = req.payload;
      let picture = req.file?.path;
      const data = { ...req.body, picture };
      res
        .status(200)
        .json(await User.findByIdAndUpdate(id, data, { new: true }));
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/me", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.payload;
    //console.log(id);
    res.status(200).json(await User.findByIdAndDelete(id));
  } catch (error) {
    next(error);
  }
});

router.get("/me/hosted-events", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.payload;
    console.log(id);
    res.status(200).json(await Event.find({ host: id }));
  } catch (error) {
    next(error);
  }
});

router.get("/me/subscrided-events", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.payload;
    console.log(id);
    res.status(200).json(await Event.find({ attendees: { $in: [id] } }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
