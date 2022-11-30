const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      maxLength: 20,
    },
    username: {
      type: String,
      unique: true,
    },
    picture: {
      type: String,
      default: "put pic later here default",
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    description: {
      type: String,
      maxLength: 250,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);
module.exports = User;
