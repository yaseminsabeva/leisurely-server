const router = require("express").Router();
const mongoose = require("mongoose");
const Event = require("../models/Event.model");

router.get("/", async (req, res, next) => {
  try {
    res.status(200).json(await Event.find());
  } catch (error) {
    next(error);
  }
});

router.get("/add", async (req, res, next) => {
  try {
    res.status(200);
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
