const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, default: "" },
  email: { type: String, unique: true },
  mobileNumber: { type: String, default: "not given" },
  password: { type: String },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/emerging-it/image/upload/v1697993177/Growb/default-icon/fpnvpqwno80grmvstwnc.jpg",
  },
  nid: { type: String, default: "" },
  type: {
    type: String, //"admin" | "retailer" | "menu" | "ro" | "logistic" | "default",
    default: "default",
  },
  token: { type: String },
});

module.exports = mongoose.model("users", userSchema);
