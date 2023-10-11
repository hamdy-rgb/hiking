const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, trim: true, required: true, unique: true },
  photoUrl: { type: String, default: null },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  displayName: { type: String, default: null },
  signedIn: { type: Date, default: null },
  password: { type: String, required: true },
  refreshToken: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
