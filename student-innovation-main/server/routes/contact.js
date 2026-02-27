const express = require("express");
const { Contact } = require("../model");

const router = express.Router();

router.post("/", async (req, res) => {
  const msg = new Contact(req.body);
  await msg.save();
  res.json({ message: "Message received" });
});

module.exports = router;
