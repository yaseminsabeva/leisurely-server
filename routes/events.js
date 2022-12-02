const router = require("express").Router();
const mongoose = require("mongoose");
const protectRoute = require("../middlewares/protectRoute");
const Event = require("../models/Event.model");

router.get("/", async (req, res, next) => {
  try {
    res.status(200).json(await Event.find());
  } catch (error) {
    next(error);
  }
});

router.post("/", protectRoute, async (req, res, next) => {
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
    });
    console.log(event);
    res.status(201).json({ event });
  } catch (error) {
    next(error);
  }
});

// router.get("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     res.status(200).json(await Event.findById(id));
//   } catch (error) {
//     next(error);
//   }
// });
router.patch("/:id", protectRoute, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    res
      .status(200)
      .json(await Event.findByIdAndUpdate(id, data, { new: true }));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", protectRoute, async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    res.status(200).json(await Event.findByIdAndDelete(id));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json(await Event.findById(id).populate("host"));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
