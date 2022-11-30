const { Schema, model } = require("mongoose");

const favoritesSchema = new Schema({
  favoritedEvent: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Favorites = model("Favorites", favoritesSchema);
module.exports = Favorites;
