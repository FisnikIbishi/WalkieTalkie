// subdisease.js

const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    name: { type: String, required: true },
    diseaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Disease', required: true }
});

module.exports = mongoose.model('SubDisease', friendSchema);
