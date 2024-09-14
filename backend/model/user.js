const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, immutable: true }
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  messages: [messageSchema],
  aiTools: [{
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'AiTools' },
    tools: [{ type: mongoose.Schema.Types.ObjectId }]
  }],
  createdAt: { type: Date, default: Date.now, immutable: true },
});

module.exports = mongoose.model("User", userSchema);
