const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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
  res.send('Non-Profit Archive API is running...'); // update it to say Hike for a cure, later..
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
