const express = require("express");
const app = express();

const PORT = 3000;

const mongoose = require("mongoose");
const dbURL = "mongodb://localhost:27017/ShockItDB";
mongoose.connect(dbURL).then(() => {
  console.log("Connected to MongoDB"),
    (err) => {
      console.log("Error connecting to MongoDB", err);
    };
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const cors = require("cors");
app.use(cors());
// Middleware to log requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type, Accept"
  );
  next();
});

let users = require("./Routes/users.routes");
app.use("/users", users);

let products = require("./Routes/products.routes");
app.use("/products", products);

let carts = require("./Routes/carts.routes");
app.use("/carts", carts);

let orders = require("./Routes/orders.routes");
app.use("/orders", orders);

app.listen(PORT, (err) => {
  if (!err) console.log(`Server is running on port`, PORT);
  else console.log("Error starting server", err);
});
