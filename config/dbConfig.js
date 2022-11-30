const mongoose = require("mongoose");
require("dotenv").config();

const endpoint = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/leisurely";

mongoose
  .connect(endpoint)
  .then((db) => console.log("DB connected: ", db.connection.name))
  .catch((e) => console.error(e));
