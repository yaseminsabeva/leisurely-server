require("dotenv").config();
require("./config/dbConfig");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();

//? Services like render use something called a proxy and you need to add this to your server
app.set("trust proxy", 1);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.ORIGIN],
    credentials: true,
  })
);

app.use("/api", require("./routes/index"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/search", require("./routes/search"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/users", require("./routes/users"));
app.use("/api/events", require("./routes/events"));

require("./error-handling/index")(app);

module.exports = app;
