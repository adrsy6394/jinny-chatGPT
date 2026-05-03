const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const History = mongoose.model('History', historySchema);

module.exports = History;
