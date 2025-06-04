let express = require("express");
let productsRouter = express.Router();
let Products = require("../Models/product");

productsRouter.get("/", async (req, res) => {
  let product = await Products.find({});
  res.status(200).send(product);
});
productsRouter.get("/:id", async (req, res) => {
  let product = await Products.findById(req.params.id);
  res.status(200).send(product);
});

productsRouter.post("/addProduct", async (req, res) => {
  let product = new Products(req.body);
  await product.save();
  res.status(200).send(product);
});

productsRouter.put("/updateProduct/:id", async (req, res) => {
  let product = await Products.updateOne(
    {
      _id: req.params.id,
    },
    { $set: req.body }
  );
  res.status(200).send(product);
});

productsRouter.delete("/deleteProduct/:id", async (req, res) => {
  let product = await Products.deleteOne({ _id: req.params.id });
  res.status(200).send(product);
});

module.exports = productsRouter;
