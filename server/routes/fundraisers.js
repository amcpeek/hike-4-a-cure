const express = require("express");
const router = express.Router();
const Fundraiser = require("../models/Fundraiser");

router.post("/", async (req, res) => {
  try {
    const newFundraiser = new Fundraiser(req.body);
    const savedFundraiser = await newFundraiser.save();
    res.status(201).json(savedFundraiser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find().sort({ year: -1 });
    res.json(fundraisers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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

module.exports = router;
