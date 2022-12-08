const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Event = require("../models/Event.model");

router.get("/:username", async (req, res, next) => {
  const { username } = req.params;
  const oneAttendee = await User.findOne({ username });
  const events = await Event.find({ host: oneAttendee._id });
  const attendingEvent = await Event.find({
    attendees: oneAttendee._id,
  });
  oneAttendee._doc.events = events;
  oneAttendee._doc.attendingEvent = attendingEvent;
  res.status(200).json(oneAttendee);
});

module.exports = router;
