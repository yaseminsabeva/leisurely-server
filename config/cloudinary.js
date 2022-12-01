const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "diik9eh2s",
  api_key: process.env.CLOUDINARY_KEY || "962143277119951",
  api_secret: process.env.CLOUDINARY_SECRET || "h_dpCqXd6PNfbvnsPHpIIFcHi0U",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    folder: "first-fullstack-app",
  },
});

module.exports = multer({ storage });
