const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Fundraiser = require('./models/Fundraiser');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON in request bodies

// MongoDB Connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connection established!"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Hike For A Cure Archive API is running...');
});

app.post('/api/fundraisers', async (req, res) => {
  try {
    const newFundraiser = new Fundraiser(req.body);
    const savedFundraiser = await newFundraiser.save();
    res.status(201).json(savedFundraiser);
  } catch (err) {
    res.status(400).json({ message: err.message});
  }
});

app.get('/api/fundraisers', async (req, res) => {
  try {
    const fundraisers = (await Fundraiser.find()).toSorted({ year: -1});
    res.json(fundraisers);
  } catch (err) {
    res.status(500).json({ message: err.message})
  }
})


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
