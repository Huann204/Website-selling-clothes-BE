const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,
    status: { type: String, default: "unread" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
