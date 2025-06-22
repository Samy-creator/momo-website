const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user"); // Path to User model
const LoginLog = require("../../models/LoginLog"); // Path to LoginLog model

// Helper function to log login attempts
async function logLoginAttempt(username, status, message) {
  try {
    const newLog = new LoginLog({ username, status, message });
    await newLog.save();
  } catch (logErr) {
    console.error("Error logging login attempt:", logErr.message);
  }
}

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      username,
      password,
      // isAdmin defaults to false from schema
    });

    await user.save(); // Password will be hashed by the pre-save hook in User model

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
    };

    // --- DEBUGGING LOG FOR JWT_SECRET AT SIGNING (REGISTER) ---
    console.log(
      "DEBUG: Auth Routes (Register Sign) - JWT_SECRET is:",
      process.env.JWT_SECRET
    );
    // --- END DEBUGGING LOG ---

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Use secret from environment variables
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res
          .status(201)
          .json({ token, username: user.username, isAdmin: user.isAdmin }); // 201 Created
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error during registration.");
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      await logLoginAttempt(username, "failed", "User not found.");
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Use the matchPassword method defined in the User model
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      await logLoginAttempt(username, "failed", "Incorrect password.");
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin, // Include isAdmin in the payload
      },
    };

    // --- DEBUGGING LOG FOR JWT_SECRET AT SIGNING (LOGIN) ---
    // THIS IS THE LOG WE ABSOLUTELY NEED TO SEE AFTER LOGIN ATTEMPT!
    console.log(
      "DEBUG: Auth Routes (Login Sign) - JWT_SECRET is:",
      process.env.JWT_SECRET
    );
    // --- END DEBUGGING LOG ---

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Use secret from environment variables
      { expiresIn: "1h" }, // Token expires in 1 hour
      async (err, token) => {
        if (err) throw err;
        await logLoginAttempt(username, "success", "Authenticated.");
        res.json({ token, username: user.username, isAdmin: user.isAdmin });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error during login.");
  }
});

module.exports = router;
