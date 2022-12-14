const router = require("express").Router();
const protectRoute = require("../middlewares/protectRoute");
const Event = require("../models/Event.model");
const uploader = require("../config/cloudinary");
const mongoose = require("mongoose");

router.get("/", async (req, res, next) => {
  const filters = {};

  const and = [];

  if (req.query?.title)
    and.push({ title: { $regex: req.query.title, $options: "i" } });

  if (req.query?.checkers) {
    const checkers = JSON.parse(req.query.checkers);
    const or = [];
    for (const key in checkers) {
      if (checkers[key]) or.push({ category: key });
    }
    if (or.length) and.push({ $or: or });
  }

  if (req.query?.startDate)
    and.push({ dateOfEvent: { $gte: req.query.startDate } });

  if (req.query?.endDate)
    and.push({ dateOfEvent: { $lte: req.query.endDate } });

  //chain filter conditions before this line
  if (and.length) filters.$and = and;

  try {
    res.status(200).json(await Event.find(filters).sort({ _id: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  uploader.single("image"),
  protectRoute,
  async (req, res, next) => {
    try {
      const {
        title,
        category,
        description,
        keywords,
        dateOfEvent,
        time,
        location,
        price,
      } = req.body;

      if (
        title === "" ||
        category === "" ||
        description === "" ||
        keywords === "" ||
        dateOfEvent === "" ||
        time === "" ||
        location === "" ||
        price === ""
      ) {
        res.status(400).json({ message: "Please fill the required fields." });
        return;
      }
      const todaysDate = new Date();
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      if (
        dateOfEvent < Intl.DateTimeFormat("sv-SE").format(todaysDate) ||
        dateOfEvent > Intl.DateTimeFormat("sv-SE").format(futureDate)
      ) {
        res.status(400).json({
          message:
            "Event date cannot be in the past or later than one year in the future.",
        });
        return;
      }

      const event = await Event.create({
        title,
        category,
        description,
        keywords,
        dateOfEvent,
        time,
        location,
        price,
        host: req.currentUser._id,
        image: req.file?.path,
      });
      console.log(event);
      res.status(201).json({ event });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Something went terribly wrong." });
    }
  }
);

router.patch(
  "/:id",
  uploader.single("image"),
  protectRoute,
  async (req, res, next) => {
    const {
      title,
      category,
      description,
      keywords,
      dateOfEvent,
      time,
      location,
      price,
    } = req.body;

    if (
      title === "" ||
      category === "" ||
      description === "" ||
      keywords === "" ||
      dateOfEvent === "" ||
      time === "" ||
      location === "" ||
      price === ""
    ) {
      res.status(400).json({ message: "Please fill the required fields." });
      return;
    }
    const todaysDate = new Date();
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    if (
      dateOfEvent < Intl.DateTimeFormat("sv-SE").format(todaysDate) ||
      dateOfEvent > Intl.DateTimeFormat("sv-SE").format(futureDate)
    ) {
      res.status(400).json({
        message:
          "Event date cannot be in the past or later than one year in the future.",
      });
      return;
    }
    try {
      const { id } = req.params;
      const image = req.file?.path;
      const data = { ...req.body, image };
      console.log(req.body);

      const update = await Event.findOneAndUpdate(
        { _id: id, host: req.currentUser.id },
        data,
        { new: true }
      );
      res.status(200).json(update);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Something went terribly wrong." });
    }
  }
);

router.patch("/:id/subscribe", protectRoute, async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.currentUser.id;
    res.status(200).json(
      await Event.findByIdAndUpdate(
        id,
        { $push: { attendees: { _id: currentUserId } } },
        { new: true }
      )
        .populate("attendees")
        .exec()
    );
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", protectRoute, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Event.findOneAndDelete({ _id: id, host: req.currentUser.id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json(await Event.findById(id).populate("host attendees"));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
