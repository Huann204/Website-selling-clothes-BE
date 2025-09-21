const mongoose = require("mongoose");
const slugify = require("slugify");

const testApiSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true }, // auto-generate từ title
    category: { type: String, required: true },
    gender: { type: String, enum: ["her", "him", "unisex"], required: true },
    subcategory: { type: String },

    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },

    description: { type: String },
    form: { type: String },
    origin: { type: String },

    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    thumbnail: {
      src: { type: String, required: true },
      alt: { type: String, default: "" },
    },
    hoverImage: {
      src: { type: String },
      alt: { type: String, default: "" },
    },

    images: [
      {
        src: { type: String },
        alt: { type: String, default: "" },
      },
    ],

    variants: [
      {
        color: {
          name: { type: String, required: true },
        },
        sizes: [
          {
            size: { type: String, required: true },
            stock: { type: Number, default: 0 },
            // sku: { type: String, required: true },
          },
        ],
      },
    ],

    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },

    brand: { type: String, default: "No Brand" },
    currency: { type: String, default: "VND" },
  },
  { timestamps: true }
);
testApiSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Test", testApiSchema);
