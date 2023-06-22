// disease.js

const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model('Disease', friendSchema);
