const express = require("express");
const router = express.Router();
const Section = require("../models/Section");

router.post("/", async (req, res) => {
  try {
    const newSection = new Section(req.body);
    const savedSection = await newSection.save();
    res.status(201).json(savedSection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const sections = await Section.find().sort({ order: 1 });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reorder must come before /:id routes
router.put("/reorder", async (req, res) => {
  try {
    const { orderedIds } = req.body; // Array of section IDs in desired order
    const updates = orderedIds.map((id, index) =>
      Section.findByIdAndUpdate(id, { order: index }, { new: true }),
    );
    await Promise.all(updates);
    const sections = await Section.find().sort({ order: 1 });
    res.status(200).json(sections);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const sectionToUpdate = await Section.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        order: req.body.order,
        photos: req.body.photos,
      },
      { new: true },
    );
    res.status(200).json(sectionToUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedSection = await Section.findByIdAndDelete(req.params.id);
    if (!deletedSection) {
      return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json(deletedSection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
