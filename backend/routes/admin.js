const express = require("express");
const Admin = require("../model/admin");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "error", error: "Invalid email or password" });
    }

    const isMatch = await Admin.findOne({ password: password });
    if (!isMatch) {
      return res.status(401).json({ message: "error", error: "Invalid email or password" });
    }

    return res.status(200).json({ message: "success", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "error", error: error });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await Admin.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "error", error: "User already exists" });
    }

    const user = new Admin({ email, password });
    await user.save();

    return res.status(201).json({ message: "success", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "error", error: error });
  }
});

module.exports = router;
