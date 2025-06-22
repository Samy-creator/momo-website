const express = require("express");
const router = express.Router();
const HomepageContent = require("../../models/HomepageContent"); // Adjust path as needed
const auth = require("../../middleware/auth"); // Your existing auth middleware
const adminAuth = require("../../middleware/adminAuth"); // Your new adminAuth middleware

// @route   GET /api/homepage
// @desc    Get all homepage content sections
// @access  Public (anyone can view homepage content)
router.get("/", async (req, res) => {
  try {
    const content = await HomepageContent.find({});
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error: Could not fetch homepage content.");
  }
});

// @route   PUT /api/homepage/:sectionName
// @desc    Update a specific homepage content section
// @access  Private (Admin only) - requires JWT and admin privileges
router.put("/:sectionName", auth, adminAuth, async (req, res) => {
  const { sectionName } = req.params;
  const { title, subtitle, description, imageUrl, items } = req.body;

  // Build an object with fields to update, only including those present in the request body
  const contentFields = {};
  if (title !== undefined) contentFields.title = title;
  if (subtitle !== undefined) contentFields.subtitle = subtitle;
  if (description !== undefined) contentFields.description = description;
  if (imageUrl !== undefined) contentFields.imageUrl = imageUrl;
  if (items !== undefined) contentFields.items = items;
  contentFields.lastUpdated = Date.now(); // Update timestamp on modification

  try {
    // Attempt to find and update existing content for the given sectionName
    let content = await HomepageContent.findOneAndUpdate(
      { sectionName: sectionName }, // Find by sectionName
      { $set: contentFields }, // Set the new fields
      { new: true, upsert: true, runValidators: true } // Return updated doc, create if not exists, run schema validators
    );

    res.json(content); // Send back the updated/created content
  } catch (err) {
    console.error(err.message);
    // Handle validation errors or other MongoDB errors
    if (err.name === "ValidationError") {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send("Server Error: Could not update homepage content.");
  }
});

// You might also want a POST route if you envision creating entirely new, dynamic sections
// beyond 'hero', 'about', 'products' from the admin panel.
// Example POST route (uncomment if needed):
/*
router.post('/', auth, adminAuth, async (req, res) => {
  const { sectionName, title, subtitle, description, imageUrl, items } = req.body;
  try {
    // Check if a section with this name already exists
    let existingContent = await HomepageContent.findOne({ sectionName });
    if (existingContent) {
      return res.status(400).json({ msg: 'A section with this name already exists.' });
    }

    const newContent = new HomepageContent({
      sectionName, title, subtitle, description, imageUrl, items
    });

    await newContent.save();
    res.status(201).json(newContent); // 201 Created

  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server Error: Could not create new homepage section.');
  }
});
*/

module.exports = router;
