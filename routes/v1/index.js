const express = require("express");
const router = express.Router();

const userRoute = require("./users");
const productRoute = require("./products");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Inventory" });
});

router.use("/user", userRoute);
router.use("/product", productRoute);

module.exports = router;
