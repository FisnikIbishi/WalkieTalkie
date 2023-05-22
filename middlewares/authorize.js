const jwt = require('express-jwt');
const { secret } = require('../config.json');
const User = require('../models/user')

function authorize(roles = []) {
    return [
        // authorize based on user role
        async (req, res, next) => {
            try {
                const token = req.cookies.token;

                if (!token) {
                    res.redirect('/login')
                }

                const user = await User.findOne({ token: token })
                if (!user) {
                    res.redirect('/login')
                }
                next();
            } catch (error) {}
        }
    ];
}

module.exports = authorize;