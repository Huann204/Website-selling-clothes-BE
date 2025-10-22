const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        province: { type: String, required: true },
        district: { type: String, required: true },
        ward: { type: String, required: true },
        street: { type: String, required: true },
        // Thêm 2 field này cho GHN
        districtId: { type: Number }, // District ID của GHN
        wardCode: { type: String }, // Ward Code của GHN
      },
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: { type: String, required: true },
        slug: { type: String, required: true },
        thumbnail: { type: String },
        color: { type: String },
        size: { type: String },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],

    payment: {
      method: {
        type: String,
        enum: ["card", "shoppeepay", "cod", "momo"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
    },

    shipping: {
      fee: { type: Number, default: 20000 },
      status: {
        type: String,
        enum: ["preparing", "shipping", "delivered", "cancelled"],
        default: "preparing",
      },
      trackingNumber: { type: String },
    },

    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    grandTotal: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
