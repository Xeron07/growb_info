var express = require("express");
var router = express.Router();
const V1 = require("./v1/products");
/* GET home page. */
router.get("/v1", V1);

module.exports = router;
