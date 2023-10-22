const express = require("express");
const router = express.Router();
const retailerModel = require("../../model/shops");
const menufectureValidation = require("../validator/menufectureValidation");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Welcome to growb");
});

router.get("/all", async (req, res) => {
  try {
    const menufectures = await retailerModel.find({});
    res.status(200).json({ success: true, dataSource: menufectures });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      error: "Something went wrong, please try again",
    });
  }
});

// Search for retailers by shop name
router.get("/search", async (req, res) => {
  const shopName = req.query.shopName; // Assuming you pass the shop name as a query parameter

  try {
    const retailers = await retailerModel.find({
      shopName: new RegExp(shopName, "i"),
    });

    if (retailers.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Retailers not found" });
    }

    res.status(200).json({ success: true, dataSource: retailers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const menufectur = await retailerModel.findOne({
      id: req.params.id || "",
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

/**
 * api link: /menufecture/add (method: post)
 * (body: {name,
      email,
      mobileNumber,
      shopName,
      address,
      nid,
      tin,
      ownerNumber,
      tradeLic,
      ownerAddress,
      whatsapp})
 */
router.post("/add", async (req, res) => {
  try {
    const {
      name,
      email,
      mobileNumber,
      shopName,
      address,
      whatsapp,
      shipping,
      ownerName,
    } = req.body;

    // Validate user input
    const validate = menufectureValidation(req.body);
    if (!validate.error) {
      try {
        const oldUser = await retailerModel.findOne({ mobileNumber });
        if (oldUser) {
          return res.status(409).json({
            success: false,
            error: "Menufecture Already Exist.",
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          error: "Something went wrong, please try again",
        });
      }

      const menufecture = await retailerModel.create({
        id: Date.now(),
        name,
        shopName,
        shipping,
        ownerName,
        location: {
          address,
        },
        social_connections: { whatsapp },
        email: email.toLowerCase(),
        mobileNumber,
      });

      // return new user
      res.status(200).json({ success: true, dataSource: menufecture });
    } else {
      return res.status(400).json({ success: false, errors: validate.error });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Something went wrong, please try again",
    });
  }
});

module.exports = router;
