let express = require("express");
let cartRouter = express.Router();
let Cart = require("../Models/cart");
const Product = require("../Models/product"); // נתיב לדגם המוצרים

cartRouter.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).send({ error: "Email is required" });
    }

    const userCart = await Cart.findOne({ email }).populate("items.productId");

    if (!userCart) {
      return res.status(404).send({ error: "Cart not found" });
    }

    res.status(200).send(userCart);
  } catch (err) {
    console.error("Server error:", err); // ← חשוב כדי לראות את השגיאה במסוף
    res.status(500).send({ error: "Server error" });
  }
});

cartRouter.post("/addToCart", async (req, res) => {
  try {
    const { email, productId, quantity } = req.body;

    const userCart = await Cart.findOne({ email });

    if (!userCart) {
      const newCart = new Cart({
        email,
        items: [{ productId, quantity }],
      });

      await newCart.save();
      return res.status(201).json({ message: "Cart created and item added" });
    }

    // אם קיימת עגלה – בדוק אם המוצר כבר קיים
    const existingItem = userCart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      // אם המוצר קיים – עדכן כמות
      existingItem.quantity += quantity;
    } else {
      // אחרת – הוסף מוצר חדש
      userCart.items.push({ productId, quantity });
    }

    await userCart.save();
    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
cartRouter.put("/cart/pay/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const userCart = await Cart.findOne({ email });

    if (!userCart || userCart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty or not found" });
    }

    for (const cartItem of userCart.items) {
      const product = await Product.findById(cartItem.productId);
      if (!product) continue;

      // ודא שיש מספיק מלאי
      if (product.stock < cartItem.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }

      // עדכן מלאי
      product.stock -= cartItem.quantity;
      await product.save();
    }

    // 3. נקה את תוכן העגלה (אפשר גם למחוק את המסמך כולו אם אתה מעדיף)
    userCart.payed = true;
    await userCart.save();

    res.json({
      message: "Payment successful. Cart cleared and stock updated.",
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res
      .status(500)
      .json({ message: "Error processing payment.", error: error.message });
  }
});

module.exports = cartRouter;
