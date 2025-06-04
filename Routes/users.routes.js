let express = require("express");
let usersRouter = express.Router();
let Users = require("../Models/user");

usersRouter.get("/", async (req, res) => {
  let users = await Users.find({}, { _id: 0 });
  res.status(200).send(users);
});

usersRouter.get("/:mail", async (req, res) => {
  let user = await Users.find({ mail: req.params.mail });
  res.status(200).send(user);
});

usersRouter.post("/register", async (req, res) => {
  let user = new Users(req.body);
  await user.save();
  res.status(200).send(user);
});

usersRouter.put("/updateUser/:mail", async (req, res) => {
  let user = await Users.updateOne(
    { mail: req.params.mail },
    { $set: req.body }
  );
  res.status(200).send(user);
});

usersRouter.delete("/deleteUser/:mail", async (req, res) => {
  let user = await Users.findOneAndRemove({ mail: req.params.mail });
  res.status(200).send(user);
});

module.exports = usersRouter;
