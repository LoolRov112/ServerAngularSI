const mongoose = require("mongoose");
let User = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    name: { type: String },
    mail: { type: String, unique: true },
    birthDate: { type: Date },
    gender: { type: String },
    image: { type: String },
    password: { type: String },
    isAdmin: { type: Boolean },
  },
  { collection: "Users", versionKey: false }
);
module.exports = mongoose.model("Users", User);
