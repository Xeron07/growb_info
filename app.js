require("dotenv").config();
require("./config/db").connect();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const router = require("./routes");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", (req, res) => res.send("Hello World"));
app.use("/api", router);

module.exports = app;
