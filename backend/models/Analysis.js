const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  fileName: String,
  jdExcerpt: String,
  score: Number,
  jdSkills: [String], // skills extracted from the JD
  presentSkills: [String],
  missingSkills: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analysis", analysisSchema);
