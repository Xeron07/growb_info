var express = require("express");
var router = express.Router();
const V1 = require("./v1");

/* GET home page. */
router.get("/", (req, res) => res.send("Hello brothers"));

/* GET home page. */
router.use("/v1", V1);

module.exports = router;
