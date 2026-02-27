const mongoose = require("mongoose");

/* USER SCHEMA */
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

/* IDEA SCHEMA */
const IdeaSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  User: mongoose.model("User", UserSchema),
  Idea: mongoose.model("Idea", IdeaSchema),
};
