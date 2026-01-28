const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const fundraiserRoutes = require("./routes/fundraisers");
const sectionRoutes = require("./routes/sections");
const uploadRoutes = require("./routes/upload");

const app = express();

// CORS - allow localhost for dev and production frontend
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connection established!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Hike For A Cure Archive API is running...");
});

app.use("/api/fundraisers", fundraiserRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
