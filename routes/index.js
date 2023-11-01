var express = require("express");
var router = express.Router();
const userModel = require("../model/user");
const V1 = require("./v1");
const jwt = require("jsonwebtoken");

const config = process.env;

/* GET home page. */
router.use("/v1", V1);

/* POST refresh token */
router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }
  try {
    const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_KEY);
    const { user_id } = decoded;

    if (!user_id) {
      return res.status(400).json({ error: "Refresh token is not valid" });
    }

    const user = await userModel.findOne({ _id: user_id });

    if (user) {
      // In a real application, validate the refresh token, check if it's expired, and look up the associated user.

      // Create token
      const accessToken = jwt.sign(
        {
          user_id: user._id,
          email: user?.email,
          id: user.id,
          avatar: user?.avatar,
          name: user?.name,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      return res.json({ accessToken });
    } else {
      return res.status(400).json({ error: "Refresh token is required" });
    }
  } catch (exception) {
    console.error(exception);
    return res.status(400).json({ error: "Refresh token is not valid" });
  }
});

/* GET home page. */
router.get("/", (req, res) => res.send("Hello brothers"));

module.exports = router;
