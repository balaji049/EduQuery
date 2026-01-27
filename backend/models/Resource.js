const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  fileType: String,
  content: String, // extracted text (later used for AI)
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resource", ResourceSchema);
