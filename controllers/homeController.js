require('dotenv').config();
const User = require('../models/user');
const userRepository = require('../repositories/userRepository.js');

module.exports = {
    home: async function (req, res) {
        res.render('home');
    },
    test: async function (req, res) {
        res.status(200).json({name:'Fisnik'});
    }
}