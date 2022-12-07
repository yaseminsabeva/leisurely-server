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
    const { name, username, email } = req.body;

    if (email === "" || name === "" || username === "") {
      res.status(400).json({ message: "Please fill in the required fields." });
      return;
    }

    const regexUsername = /^[a-z0-9_.]+$/;

    if (!regexUsername.test(username)) {
      return res.status(400).json({
        message:
          "Usernames can only use letters, numbers, underscores, and periods.",
      });
    }

    try {
      const foundUser = await User.findOne({ $or: [{ email }, { username }] });
      const { id } = req.payload;
      console.log(id, foundUser.id);
      if (foundUser && id !== foundUser.id) {
        res
          .status(400)
          .json({ message: "Email or username are already in use." });
        return;
      }
      let picture = req.file?.path;
      const data = { ...req.body, picture };
      res
        .status(200)
        .json(await User.findByIdAndUpdate(id, data, { new: true }));
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Something went terribly wrong." });
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
