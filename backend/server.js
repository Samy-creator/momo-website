const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port

// Middleware
app.use(cors());
app.use(bodyParser.json()); // For parsing JSON request bodies

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/loginApp", {
    useNewUrlParser: true, // Deprecated, but good to keep for compatibility
    useUnifiedTopology: true, // Deprecated, but good to keep for compatibility
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import only the LoginLog model directly if it's used within server.js itself (for /api/logins routes)
const LoginLog = require("./models/LoginLog");

// Import your API route modules
const authRoutes = require("./routes/api/auth");
const homepageRoutes = require("./routes/api/homepage");

// Use your API routes
app.use("/api/auth", authRoutes); // Handles /api/auth/login, /api/auth/register etc.
app.use("/api/homepage", homepageRoutes); // Handles /api/homepage, /api/homepage/:sectionName

// Routes for login logs (these use the LoginLog model imported above)
app.get("/api/logins", async (req, res) => {
  try {
    const logs = await LoginLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    console.error("Error fetching login logs:", err.message);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

app.delete("/api/logins", async (req, res) => {
  try {
    await LoginLog.deleteMany({});
    res.json({ message: "All logs deleted" });
  } catch (err) {
    console.error("Error deleting login logs:", err.message);
    res.status(500).json({ error: "Failed to delete logs" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
