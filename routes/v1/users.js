const bcrypt = require("bcryptjs/dist/bcrypt");
var express = require("express");
var router = express.Router();
const userModel = require("../../model/user");
const jwt = require("jsonwebtoken");
const userValidation = require("../validator/userValidator");
const SerialNumberGenerator = require("../../utilities/uniqueCode");

const serialNumberGenerator = new SerialNumberGenerator();
/* GET users listing. */

/**
 * api link: /users/signup (method: post)
 * (body: {name, email, mobileNumber, password})
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, mobileNumber, password, nid, type } = req.body;

    // Validate user input
    const validate = userValidation(req.body);
    if (!validate.error) {
      try {
        const oldUser = await userModel.findOne({ email });
        if (oldUser) {
          return res.status(409).json({
            success: false,
            error: "User Already Exist. Please Login",
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          error: "Something went wrong, please try again",
        });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create({
        id: serialNumberGenerator.generateUniqueCode(),
        name,
        email: email.toLowerCase(),
        mobileNumber,
        nid: !!nid ? nid : "",
        type,
        password: encryptedPassword,
      });

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email, id: user.id },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // Create the refresh token
      const refreshToken = jwt.sign(
        { user_id: user._id },
        process.env.REFRESH_TOKEN_KEY,
        {
          expiresIn: "30d", // You can adjust the expiration time
        }
      );
      // save user token
      user.token = token;
      user.refreshToken = refreshToken;

      user.save();

      // return new user
      res.status(201).json(user);
    } else {
      return res.status(403).json({ errors: validate.error });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Something went wrong, please try again",
    });
  }
});

/**
 * api link: /users/login (Method: POST)
 * body: {email,password}
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate user input
    if (!(!!email && !!password)) {
      res.status(403).json({ success: false, error: "All input is required" });
    }
    // Validate if user exist in our database
    const user = await userModel.findOne({ email });

    if (!!user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
          id: user.id,
          avatar: user?.avatar,
          name: user?.name,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // Create the refresh token
      const refreshToken = jwt.sign(
        { user_id: user._id },
        process.env.REFRESH_TOKEN_KEY,
        {
          expiresIn: "30d", // You can adjust the expiration time
        }
      );

      // save user token
      user.token = token;
      user.refreshToken = refreshToken;

      user.save();

      // user
      return res.status(200).json({ success: true, dataSource: user });
    } else
      return res
        .status(403)
        .json({ success: false, error: "Email or password is incorrect" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Something went wrong, please try again",
    });
  }
});

/* GET user by id */
router.get("/by/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const menufectur = await userModel.findOne({
      _id: req.params.id || "",
    });
    res.status(200).json({ success: true, dataSource: menufectur });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      error: "Something went wrong, please try again",
    });
  }
});
module.exports = router;
