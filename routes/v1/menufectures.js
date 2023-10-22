const express = require("express");
const router = express.Router();
const menufectureModel = require("../../model/manufectures");
const menufectureValidation = require("../validator/menufectureValidation");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Welcome to growb");
});

router.get("/all", async (res, req) => {
  try {
    const menufectures = await menufectureModel.find({});
    res.status(200).json({ success: true, dataSource: menufectures });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      error: "Something went wrong, please try again",
    });
  }
});

router.get("/:id", async (res, req) => {
  try {
    const menufectur = await menufectureModel.findOne({
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
      nid,
      tin,
      ownerNumber,
      tradeLic,
      ownerAddress,
      whatsapp,
    } = req.body;

    // Validate user input
    const validate = menufectureValidation(req.body);
    if (!validate.error) {
      try {
        const oldUser = await menufectureModel.findOne({ mobileNumber });
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

      const menufecture = await menufectureModel.create({
        id: Date.now(),
        name,
        shopName,
        ownerName,
        location: {
          address,
        },
        documents: {
          nid,
          tin,
          ownerAddress,
          ownerNumber,
          tradeLic,
        },
        social_connections: { whatsapp },
        email: email.toLowerCase(),
        mobileNumber,
      });

      // return new user
      res.status(201).json({ success: true, dataSource: menufecture });
    } else {
      return res.status(403).json({ success: false, errors: validate.error });
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
