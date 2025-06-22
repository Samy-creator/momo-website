const mongoose = require("mongoose");

const HomepageContentSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
    unique: true, // Ensures only one document per section (e.g., 'hero', 'about', 'products')
    trim: true, // Removes whitespace from start/end of the string
  },
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  imageUrl: {
    // For images associated with sections (e.g., hero banner image)
    type: String,
    default: "",
  },
  items: [
    // This array is for repeatable content like menu items/products
    {
      id: {
        // Unique ID for each item within the array (important for React list keys)
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(), // Generates a unique string ID
        required: true,
      },
      name: { type: String, default: "" },
      price: { type: Number, default: 0 },
      description: { type: String, default: "" },
      image: { type: String, default: "" }, // Image URL for the product/menu item
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now, // Automatically set update timestamp
  },
});

module.exports = mongoose.model("HomepageContent", HomepageContentSchema);
