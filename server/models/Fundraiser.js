const mongoose = require("mongoose");

const fundraiserSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true, unique: true },
    title: { type: String },
    description: { type: String },
    amountRaised: { type: Number, default: 0 },
    photoUrl: String,
  },
  { timeStamps: true },
);

module.exports = mongoose.model("Fundraiser", fundraiserSchema);
