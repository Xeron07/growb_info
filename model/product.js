const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, default: null },
  discount: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  unitPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
  productCode: { type: String },
  sku: { type: String, default: "HEX00--1" },
  variation: [
    {
      id: { type: Number },
      size: { type: String, default: "" },
      color: { type: String, default: "" },
      name: { type: String, default: "" },
      title: { type: String, default: "" },
      vCode: { type: String, default: "" },
    },
  ],
});

module.exports = mongoose.model("products", productSchema);
