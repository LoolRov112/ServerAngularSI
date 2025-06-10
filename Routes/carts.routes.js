let express = require("express");
let cartRouter = express.Router();
let Cart = require("../Models/cart");

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

module.exports = cartRouter;
