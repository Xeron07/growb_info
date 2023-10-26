const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");

const userRoute = require("./users");
const productRoute = require("./products");
const menufectureRoute = require("./menufectures");
const retailerRoute = require("./retailers");
const transectionRoute = require("./transections");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Welcome to growb");
});

router.use("/user", userRoute);
router.use("/product", productRoute);
router.use("/menufecture", auth, menufectureRoute);
router.use("/retailer", auth, retailerRoute);
router.use("/transection", transectionRoute);

module.exports = router;
