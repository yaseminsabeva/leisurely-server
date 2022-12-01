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
      default:
        "https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg",
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
      //default: "Your description here",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);
module.exports = User;
