const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Import bcryptjs for password hashing

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure usernames are unique
    trim: true, // Remove leading/trailing whitespace
  },
  email: {
    type: String,
    // If you want email to be mandatory and unique, uncomment these:
    // required: true,
    // unique: true,
    trim: true,
    sparse: true, // Allows multiple documents with null email if not required, useful if email is optional
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false, // Regular users are not admins by default
  },
});

// Mongoose Pre-save hook: Hash the password before saving the user document
UserSchema.pre("save", async function (next) {
  // Only hash the password if it's new or has been modified
  if (!this.isModified("password")) {
    return next();
  }
  // Generate a salt and then hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Mongoose Method: Compare an entered password with the hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// CRITICAL FIX: Export the model, checking if it already exists to prevent OverwriteModelError
// This line ensures that `mongoose.model('User', UserSchema)` is called only once.
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
