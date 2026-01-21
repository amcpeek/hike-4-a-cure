const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String }, // Stores HTML from WYSIWYG editor
    order: { type: Number, default: 0 },
    photos: [
      {
        url: { type: String, required: true },
        tag: { type: String },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Section", sectionSchema);
