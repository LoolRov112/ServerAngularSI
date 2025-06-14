// models/order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    date: { type: Date, default: Date.now },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
        quantity: Number,
      },
    ],
  },
  {
    collection: "Orders",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Orders", orderSchema);
