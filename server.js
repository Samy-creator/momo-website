const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key";

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/loginApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ MongoDB connection error:"));
db.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

const loginLogSchema = new mongoose.Schema({
  username: String,
  status: String, // "success" or "fail"
  reason: String,
  timestamp: { type: Date, default: Date.now },
});
const LoginLog = mongoose.model("LoginLog", loginLogSchema);

const users = [
  {
    username: "admin",
    password: bcrypt.hashSync("admin123", 10),
  },
];

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const timestamp = new Date();

  const user = users.find((u) => u.username === username);

  if (!user) {
    await LoginLog.create({
      username,
      status: "fail",
      reason: "invalid username",
      timestamp,
    });
    return res.status(401).json({ error: "Invalid username" });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    await LoginLog.create({
      username,
      status: "fail",
      reason: "invalid password",
      timestamp,
    });
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  await LoginLog.create({
    username,
    status: "success",
    reason: "authenticated",
    timestamp,
  });

  res.json({ token, username });
});

app.get("/api/logins", async (req, res) => {
  try {
    const logs = await LoginLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

app.delete("/api/logins", async (req, res) => {
  try {
    await LoginLog.deleteMany({});
    res.json({ message: "All logs deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete logs" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
