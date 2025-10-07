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
        enum: ["card", "shoppeepay", "cod"], // ATM/visa, ví, COD
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
    },

    discount: { type: Number, default: 0 }, // số tiền giảm giá
    total: { type: Number, required: true }, // tổng tiền chưa phí ship
    grandTotal: { type: Number, required: true }, // tổng cuối cùng (cộng ship - giảm giá)

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
