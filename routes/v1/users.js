const bcrypt = require("bcryptjs/dist/bcrypt");
var express = require("express");
var router = express.Router();
const userModel = require("../../model/user");
const jwt = require("jsonwebtoken");
const userValidation = require("../validatior/userValidation");

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
          return res.status(409).send("User Already Exist. Please Login");
        }
      } catch (err) {
        console.log(err);
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create({
        id: Date.now(),
        name,
        email: email.toLowerCase(),
        mobileNumber,
        nid,
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
      // save user token
      user.token = token;

      // return new user
      res.status(201).json(user);
    } else {
      return res.status(404).json({ errors: validate.error });
    }
  } catch (err) {
    console.error(err);
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
    if (!(email && password)) {
      res.status(403).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email, id: user.id },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
