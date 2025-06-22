const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema({
  username: String,
  status: String, // "success" or "fail"
  reason: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LoginLog", loginLogSchema);
