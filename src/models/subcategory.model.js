const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    slug: { type: String, required: true, unique: true },

    category: {
      type: String,
      enum: ["for-her", "for-him", "unisex"],
      required: true,
    },

    status: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Subcategory", subcategorySchema);
