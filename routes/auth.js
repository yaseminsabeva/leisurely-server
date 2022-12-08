const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const uploader = require("../config/cloudinary");
const isAuthenticated = require("../middlewares/jwt.middleware");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const saltRounds = 10;

/** All the routes are prefixed with `/api/auth` */

router.post("/signup", uploader.single("picture"), async (req, res, next) => {
  const { name, username, email, password, description } = req.body;
  let picture;
  if (req.file) {
    picture = req.file.path;
  }
  if (email === "" || name === "" || username === "" || password === "") {
    res.status(400).json({ message: "Please fill in the required fields." });
    return;
  }

  const regexPw = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  const regexUsername = /^[a-z0-9_.]+$/;

  if (!regexPw.test(password)) {
    return res.status(400).json({
      message:
        "Password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  if (!regexUsername.test(username)) {
    return res.status(400).json({
      message:
        "Usernames can only use letters, numbers, underscores, and periods.",
    });
  }

  try {
    const foundUser = await User.findOne({ $or: [{ email }, { username }] });
    if (foundUser) {
      res
        .status(400)
        .json({ message: "Email and username need to be unique." });
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPass = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({
      name,
      username,
      email,
      password: hashedPass,
      description,
      picture,
    });

    const user = createdUser.toObject();
    delete user.password;
    // ! Sending the user as json to the client
    res.status(201).json({ user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Something went terribly wrong." });
  }
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400).json({ message: "Please fill in the required fields." });
    return;
  }
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.status(401).json({ message: "Wrong credentials" });
      return;
    }
    const goodPass = bcrypt.compareSync(password, foundUser.password);
    if (goodPass) {
      const user = foundUser.toObject();
      delete user.password;

      const authToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "2d",
      });

      res.status(200).json({ authToken });
    } else {
      res.status(401).json({ message: "Wrong credentials." });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Something went terribly wrong." });
  }
});

module.exports = router;
