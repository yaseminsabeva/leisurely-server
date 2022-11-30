require("./../config/dbConfig");
const Event = require("./../models/Event.model");
const events = require("./../events.json");
const User = require("./../models/User.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const superUser = {
  username: "admin",
  email: "admin@admin.com",
  password: process.env.SUPERUSER_PW,
};

seed();

async function createUser() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(superUser.password, salt);
  superUser.password = hashedPassword;
  const newUser = await User.create(superUser);
  const userId = newUser._id;
  const eventsWithId = events.map((ele) => {
    ele.host = userId;
    return ele;
  });
  return eventsWithId;
}

async function seed() {
  await cleanDatabase();
  const eventsWithId = await createUser();
  await Event.create(eventsWithId);

  process.exit();
}

async function cleanDatabase() {
  await Event.deleteMany();
  await User.deleteMany();
}
