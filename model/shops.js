const mongoose = require("mongoose");
const shopSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  shipping: {
    type: {
      mobileNumber: { type: String, default: "" },
      address: { type: String, default: "" },
      reciverName: { type: String, default: "" },
    },
  },

  active: { type: Boolean, default: true },
  shopCode: { type: String, default: "" },
  sku: { type: String, default: "HEX00--1" },
  name: { type: String, default: "" },
  email: { type: String, unique: true, default: "" },
  mobileNumber: { type: String, default: "not given" },
  shopName: { type: String, default: "" },
  ownerName: { type: String, default: "" },
  icon: {
    type: String,
    default:
      "https://res.cloudinary.com/emerging-it/image/upload/v1697977543/Growb/default-icon/dotwsuppoztoak52dqun.png",
  },
  images: { type: [{ type: String }], default: [] },
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
  transections: {
    type: [
      {
        date: { type: String, default: "" },
        orderId: { type: Number, default: 0 },
        trackId: { type: Number, default: 0 },
        totalDiscount: { type: Number, default: 0 },
        totalprice: { type: Number, default: 0 },
        status: { type: String, default: "processing" },
        products: [
          {
            type: {
              icon: { type: String, default: "" },
              name: { type: String, default: "" },
              variant: { type: String, default: "" },
              quantity: { type: Number, default: 0 },
              unitPrice: { type: Number, default: 0 },
              totalPrice: { type: Number, default: 0 },
              discount: { type: Number, default: 0 },
            },
          },
        ],
        user: {
          type: {
            email: { type: String, default: "" },
            userId: { type: String, default: "" },
          },
        },
      },
    ],
    default: [],
  },
  token: { type: String },
});

module.exports = mongoose.model("shops", shopSchema);
