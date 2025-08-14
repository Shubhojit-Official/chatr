const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "model"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  history: { type: [messageSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatSession", chatSessionSchema);
