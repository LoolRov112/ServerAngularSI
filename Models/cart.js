const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],

    payed: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "Carts",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Carts", cartSchema);
