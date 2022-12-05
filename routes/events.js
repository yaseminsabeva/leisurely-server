const router = require("express").Router();
const mongoose = require("mongoose");
const protectRoute = require("../middlewares/protectRoute");
const Event = require("../models/Event.model");
const uploader = require("../config/cloudinary");

router.get("/", async (req, res, next) => {
  if (!req.query.title && !req.query.checkers) {
    return res.status(200).json(await Event.find());
  }
  const filters = { $and: [{ $or: [] }] };
  if (req.query?.title) {
    filters.$and.push({ title: { $regex: req.query.title, $options: "i" } });
  }
  if (req.query?.checkers) {
    const checkers = JSON.parse(req.query.checkers);
    for (const key in checkers) {
      if (checkers[key]) {
        filters.$and[0].$or.push({ category: key });
      }
    }
  }
  try {
    if (!filters.$and[0].$or.length) {
      filters.$and.shift();
      res.status(200).json(await Event.find(filters));
    } else {
      res.status(200).json(await Event.find(filters));
    }
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
      next(error);
    }
  }
);

// router.post("/search", async (req, res, next) => {
//   try {
//     const { searchData } = req.body;
//     console.log(searchData);
//     const foundEvent = await Event.find({
//       title: { $regex: searchData, $options: "i" },
//     });
//     res.status(201).json({ foundEvent });
//     console.log(foundEvent);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     res.status(200).json(await Event.findById(id));
//   } catch (error) {
//     next(error);
//   }
// });

router.patch(
  "/:id",
  uploader.single("image"),
  protectRoute,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const image = req.file?.path;
      const data = { ...req.body, image };
      console.log(req.body);

      const update = await Event.findByIdAndUpdate(id, data, { new: true });
      res.status(200).json(update);
    } catch (error) {
      next(error);
    }
  }
);

//jeanne//
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
//jeanne//

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
    res.status(200).json(await Event.findById(id).populate("host attendees"));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
