const express = require("express");
const router = express.Router();
const retailerModel = require("../../model/shops");
const SerialNumberGenerator = require("../../utilities/uniqueCode");

const serialNumberGenerator = new SerialNumberGenerator();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Welcome to growb");
});

router.get("/:shopId/:trackId", async (res, req) => {
  try {
    const menufectur = await retailerModel.findOne({
      id: req.params.shopId || "",
    });
    const transection = menufectur.transections.filter(
      (data) => data.trackId === req.params.trackId
    );
    res.status(200).json({
      success: true,
      dataSource: !!transection ? transection[0] : null,
    });
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
function calculateTotalPrice(products) {
  let totalPrice = 0;

  for (const product of products) {
    // Assuming you have properties: unit_price, quantity, and discount
    const unitPrice = product?.unitPrice;
    const quantity = product?.quantity;
    const discount = product?.discount;

    if (!isNaN(unitPrice) && !isNaN(quantity) && !isNaN(discount)) {
      // Calculate the total price for the product
      const productTotal = unitPrice * quantity - discount;

      // Add the product total to the overall total
      totalPrice += productTotal;
    }
  }

  return totalPrice;
}

router.post("/add", async (req, res) => {
  try {
    const { shopId, totalDiscount, products, date } = req.body;
    let oldShop;

    try {
      oldShop = await retailerModel.findOne({ id: shopId });
      if (!oldShop) {
        return res.status(409).json({
          success: false,
          error: "Retailer Doesn't Exist.",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        error: "Something went wrong, please try again",
      });
    }

    if (oldShop) {
      const totalPrice = await calculateTotalPrice(products);
      oldShop?.transections.push({
        date,
        orderId: serialNumberGenerator.generateUniqueCode(),
        trackId: serialNumberGenerator.generateUniqueCode(),
        totalDiscount: !!totalDiscount ? totalDiscount : 0,
        products,
        totalPrice,
        user: !!req.user
          ? {
              email: req?.user?.email,
              userId: req?.user?.id,
            }
          : {},
      });
      await oldShop.save();
      // return new user
      res.status(200).json({ success: true, dataSource: oldShop });
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
