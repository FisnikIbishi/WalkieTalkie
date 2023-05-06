// matchMaking.js

const mongoose = require('mongoose');

const matchMakingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'accepted', 'denied'], default: 'pending' }
});

module.exports = mongoose.model('MatchMaking', matchMakingSchema);
