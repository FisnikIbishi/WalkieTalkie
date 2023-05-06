// friendRequest.js

const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'accepted', 'denied'], default: 'pending' }
});

module.exports = mongoose.model('FriendRequest', friendRequestSchema);
