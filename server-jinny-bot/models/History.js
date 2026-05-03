const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const History = mongoose.model('History', historySchema);

module.exports = History;
