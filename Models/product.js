const mongoose = require("mongoose");
let Product = new mongoose.Schema(
  {
    name: { type: String },
    type: { type: String },
    price: { type: Number },
    image: { type: String },
    description: { type: String },
    category: { type: String },
    stock: { type: Number },
  },
  { collection: "Products", versionKey: false }
);
module.exports = mongoose.model("Products", Product);
