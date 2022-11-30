const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    title: {
      type: String,
    },
    image: {
      type: String,
      default:
        "https://www.getillustrations.com/packs/download-simple-colorful-outline-illustrations/scenes/_1x/location%20_%20not%20found,%20missing,%20place,%20destination,%20unknown,%20search,%20find_md.png",
    },
    category: {
      enum: [
        "Art & Culture",
        "Community & Environment",
        "Dancing",
        "Games",
        "Health & Wellbeing",
        "Language",
        "Music",
        "Science & Education",
        "Sports & Fitness",
        "Support & Coaching",
        "Technology",
        "Travel & Outdoor",
        "Writing & Literature",
        "Pets & Animals",
        "Other",
      ],
    },
    description: {
      type: String,
      required: true,
      maxLength: 750,
    },
    keywords: {
      type: String,
    },
    dateOfEvent: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    price: {
      type: Number,
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);
module.exports = Event;
