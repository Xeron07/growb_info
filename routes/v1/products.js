const express = require("express");
const router = express.Router();
const productModel = require("../../model/product");
const productValidator = require("../validator/productValidator");

/**
 * /product/create (Method: POST)
 * body: {name, quantity, unitPrice, color, size, discount}
 */

router.post("/create", async (req, res) => {
  try {
    const { name, quantity, unitPrice, color, size, discount } = req.body;
    const validation = productValidator(req.body);
    if (validation.error) return res.status(404).json(validation.error);

    const productCode =
      (name.length > 5
        ? name.slice(0, 5).toUpperCase().replace(" ", "_")
        : name.toUpperCase().replace(" ", "_")) +
      color[0] +
      size;

    const oldProduct = await productModel.findOne({ productCode });

    if (oldProduct) return res.status(409).send("Product already exist");

    const product = await productModel.create({
      id: Date.now(),
      name: name.trim().toUpperCase(),
      quantity: quantity || 0,
      color,
      size,
      discount: discount || 0,
      totalPrice: (quantity || 0) * (unitPrice || 0),
      unitPrice: unitPrice || 0,
      productCode,
    });

    return res.status(200).json(product);
  } catch (err) {
    console.error(err);
  }
});

router.put("/update", async (req, res) => {
  try {
    const { id, type, quantity } = req.body;

    if (!id || !type || !quantity) {
      console.log("id: %s, type: %s, quantity: %d", id, type, quantity);
      return res.status(409).send("Invalid credential");
    }

    let beforeUpdate = await productModel.findOne({ id });
    if (beforeUpdate) {
      if (type == "add") {
        beforeUpdate.quantity = beforeUpdate.quantity + quantity;
      } else if (type == "remove") {
        beforeUpdate.quantity = beforeUpdate.quantity - quantity;
      }

      beforeUpdate.totalPrice = beforeUpdate.unitPrice * beforeUpdate.quantity;
      const afterUpdate = await beforeUpdate.save();

      if (afterUpdate)
        return res
          .send(200)
          .json({ product: afterUpdate, msg: "product updated successfully" });
      else {
        return res.send(504).json({ msg: "Try again after sometime" });
      }
    } else {
      return res.status(409).send("Product not exist");
    }
  } catch (err) {
    console.log(err);
    res.send(500).send(err);
  }
});

router.put("/edit", async (req, res) => {
  try {
    const { id, name, color, size, discount, quantity, unitPrice, totalPrice } =
      req.body;

    const validation = productValidator(req.body);
    if (validation.error) return res.status(404).json(validation.error);

    let beforeUpdate = await productModel.findOne({ id });
    if (beforeUpdate) {
      const productCode =
        (name.length > 5
          ? name.slice(0, 5).toUpperCase().replace(" ", "_")
          : name.toUpperCase().replace(" ", "_")) +
        color[0] +
        size;

      beforeUpdate.name = name;
      beforeUpdate.size = size;
      beforeUpdate.color = color;
      beforeUpdate.discount = discount;
      beforeUpdate.quantity = quantity;
      beforeUpdate.unitPrice = unitPrice;
      beforeUpdate.totalPrice = totalPrice;
      beforeUpdate.productCode = productCode;

      const afterUpdate = await beforeUpdate.save();

      if (afterUpdate)
        return res
          .send(200)
          .json({ product: afterUpdate, msg: "product updated successfully" });
      else {
        return res.send(504).json({ msg: "Try again after sometime" });
      }
    } else {
      return res.status(409).send("Product not exist");
    }
  } catch (err) {
    console.log(err);
    res.send(500).send(err);
  }
});

router.post("/search", async (req, res) => {
  try {
    const { str } = req.body;
    let products = await productModel
      .find(
        {
          name: {
            $regex: new RegExp(str.toUpperCase()),
          },
        },
        {
          _id: 0,
          __v: 0,
        }
      )
      .limit(10);

    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

router.put("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    let oldProduct = await productModel.findOne({ id });
    if (oldProduct) {
      oldProduct.active = true;
      await oldProduct.save();
      return res
        .send(200)
        .json({ product: afterUpdate, msg: "product updated successfully" });
    } else {
      return res.send(504).json({ msg: "Try again after sometime" });
    }
  } catch (err) {
    console.error(err);
    return res.status(509).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

module.exports = router;
