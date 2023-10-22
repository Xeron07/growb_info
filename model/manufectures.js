const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, default: "" },
  email: { type: String, unique: true, default: "" },
  mobileNumber: { type: String, default: "not given" },
  shopName: { type: String, default: "" },
  ownerName: { type: String, default: "" },
  location: {
    address: { type: String, default: "" },
    lat: { type: String, default: "" },
    long: { type: String, default: "" },
  },
  documents: {
    nid: {
      type: String,
      default: "",
    },
    tin: {
      type: String,
      default: "",
    },
    ownerAddress: {
      type: String,
      default: "",
    },
    ownerNumber: {
      type: String,
      default: "",
    },
    tradeLic: { type: String, default: "" },
  },
  social_connections: {
    whatsapp: {
      type: String,
      default: "",
    },
  },
  token: { type: String },
});

module.exports = mongoose.model("clients", clientSchema);
