const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, default: null },
  email: { type: String, unique: true },
  mobileNumber: { type: String, default: "not given" },
  password: { type: String },
  nid: { type: String, default: "" },
  type: {
    type: "admin" | "retailer" | "menu" | "ro" | "logistic" | "default",
    default: "default",
  },
  token: { type: String },
});

module.exports = mongoose.model("users", userSchema);
