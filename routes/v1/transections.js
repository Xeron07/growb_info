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

router.get("/dashboard", async (req, res) => {
  try {
    const recentTransactions = await retailerModel.aggregate([
      // Unwind the transactions array to work with individual transactions
      { $unwind: "$transections" },

      // Match transactions with non-null product.unitPrice
      {
        $match: {
          "transections.products.unitPrice": { $ne: null },
        },
      },

      // Calculate the total amount for each transaction
      {
        $set: {
          "transections.totalAmount": {
            $sum: {
              $map: {
                input: "$transections.products",
                as: "product",
                in: {
                  $subtract: [
                    {
                      $multiply: ["$$product.unitPrice", "$$product.quantity"],
                    },
                    { $ifNull: ["$$product.discount", 0] }, // Replace null discount with 0
                  ],
                },
              },
            },
          },
        },
      },

      // Sort transactions by date in descending order (most recent first)
      { $sort: { "transections.date": -1 } },

      // Limit to the first 10 transactions
      { $limit: 10 },

      // Project the desired fields
      {
        $project: {
          _id: 0, // Exclude the _id field
          date: "$transections.date",
          orderId: "$transections.orderId",
          trackId: "$transections.trackId",
          totalDiscount: "$transections.totalDiscount",
          status: "$transections.status",
          user: "$transections.user",
          totalAmount: "$transections.totalAmount", // Include the calculated totalAmount
          shopName: "$shopName",
        },
      },
    ]);

    const totalAmount = await retailerModel.aggregate([
      // Unwind the transactions array to work with individual transactions
      { $unwind: "$transections" },

      // Match transactions with non-null product.unitPrice
      {
        $match: {
          "transections.products.unitPrice": { $ne: null },
        },
      },

      // Calculate the total amount for each transaction
      {
        $set: {
          "transections.totalAmount": {
            $sum: {
              $map: {
                input: "$transections.products",
                as: "product",
                in: {
                  $subtract: [
                    {
                      $multiply: ["$$product.unitPrice", "$$product.quantity"],
                    },
                    { $ifNull: ["$$product.discount", 0] }, // Replace null discount with 0
                  ],
                },
              },
            },
          },
        },
      },

      {
        $group: {
          _id: null,
          totalAmountSum: { $sum: "$transections.totalAmount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    const topShops = await retailerModel.aggregate([
      // Unwind the transactions array to work with individual transactions
      { $unwind: "$transections" },

      // Match transactions with non-null product.unitPrice
      {
        $match: {
          "transections.products.unitPrice": { $ne: null },
        },
      },

      // Calculate the total amount for each transaction
      {
        $addFields: {
          "transections.totalAmount": {
            $sum: {
              $map: {
                input: "$transections.products",
                as: "product",
                in: {
                  $subtract: [
                    {
                      $multiply: ["$$product.unitPrice", "$$product.quantity"],
                    },
                    { $ifNull: ["$$product.discount", 0] }, // Replace null discount with 0
                  ],
                },
              },
            },
          },
        },
      },

      // Sort transactions by totalAmount in descending order (most total amount first)
      { $sort: { "transections.totalAmount": -1 } },

      // Limit to the first 10 transactions
      { $limit: 3 },

      // Project the desired fields
      {
        $project: {
          _id: 0, // Exclude the _id field
          icon: 1,
          totalAmount: "$transections.totalAmount", // Include the calculated totalAmount
          shopName: 1,
          ownerName: 1,
          mobileNumber: 1,
        },
      },
    ]);

    return res.json({
      success: true,
      dataSource: { totalAmount, recentTransactions, topShops },
    });
  } catch (exception) {
    console.log(exception);
    return res.json({
      success: false,
      error: "Please try again after some time",
    });
  }
});

module.exports = router;
