let express = require("express");
let orderRouter = express.Router();
let Order = require("../Models/order");
const Product = require("../Models/product");

orderRouter.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    console.log("Request received for email:", email); // ← לוג ראשון

    const userOrders = await Order.find({ email }).populate("items.productId");
    // const userOrders = await Order.find({ email }); // ← שלב ראשון לבדיקה
    console.log("Found orders:", userOrders); // ← לוג שני

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).send({ error: "No orders found" });
    }

    res.status(200).send(userOrders);
  } catch (err) {
    console.error("❌ Error during /orders/:email request:", err); // ← הצגת שגיאה מלאה
    res.status(500).send({ error: "Server error", details: err.message });
  }
});

module.exports = orderRouter;
