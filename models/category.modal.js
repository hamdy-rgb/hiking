const mongoose = require("mongoose");

// Define the Category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

// Create the Category model
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
