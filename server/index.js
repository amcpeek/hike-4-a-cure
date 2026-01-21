const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Fundraiser = require("./models/Fundraiser");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON in request bodies

// MongoDB Connection
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connection established!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Basic Test Route
app.get("/", (req, res) => {
  res.send("Hike For A Cure Archive API is running...");
});

app.post("/api/fundraisers", async (req, res) => {
  //
  try {
    const newFundraiser = new Fundraiser(req.body);
    const savedFundraiser = await newFundraiser.save();
    res.status(201).json(savedFundraiser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/fundraisers/:id", async (req, res) => {
  //
  try {
    const fundraiserToUpdate = await Fundraiser.findByIdAndUpdate(
      req.params.id,
      {
        year: req.body.year,
        description: req.body.description,
        title: req.body.title,
        amountRaised: req.body.amountRaised,
        photos: req.body.photos,
      },
      { new: true },
    );
    res.status(200).json(fundraiserToUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/api/fundraisers", async (req, res) => {
  //
  try {
    const fundraisers = await Fundraiser.find().sort({ year: -1 });
    res.json(fundraisers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/fundraisers/:id", async (req, res) => {
  console.log("in BE", req.params.id);
  try {
    const deletedFundraiser = await Fundraiser.findByIdAndDelete(req.params.id);
    if (!deletedFundraiser) {
      return res.status(404).json({ message: "Fundraiser not found" });
    }
    res.status(200).json(deletedFundraiser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
