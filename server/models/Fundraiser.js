const mongoose = require("mongoose");

const fundraiserSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true, unique: true },
    title: { type: String },
    description: { type: String },
    amountRaised: { type: Number, default: 0 },
    photos: [
      {
        url: { type: String, required: true },
        tag: { type: String }, // e.g., "t-shirt design", "event photo", "group photo"
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Fundraiser", fundraiserSchema);
