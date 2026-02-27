const express = require("express");
const { Idea } = require("../model");

const router = express.Router();

/* SUBMIT IDEA */
router.post("/", async (req, res) => {
  const idea = new Idea(req.body);
  await idea.save();
  res.json({ message: "Idea saved" });
});

/* GET IDEAS */
router.get("/", async (req, res) => {
  const ideas = await Idea.find();
  res.json(ideas);
});

module.exports = router;
