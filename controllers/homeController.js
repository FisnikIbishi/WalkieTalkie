require('dotenv').config();
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository.js');

module.exports = {
    home: async function (req, res) {
        const token = req.cookies.token;
        const decoded = jwt.decode(token);
        const user = await userRepository.getUser(decoded._id);
        res.render('home', {
            user: user
        });
    }
}