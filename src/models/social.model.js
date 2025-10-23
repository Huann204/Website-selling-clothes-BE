const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema({
  facebook: String,
  instagram: String,
  zalo: String,
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Social", socialSchema);
