const jwt = require('express-jwt');
const { secret } = require('../config.json');
const User = require('../models/user')

function authorize(roles = []) {
    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req, res, next) => {
            try {
                const user = await User.findOne({ _id: req.user._id })
                if (!user || user.token === '') {
                    throw new Error("User not authenticated!");
                }

                // authentication and authorization successful
                req.user = { 
                    _id: user._id
                }
                next();
            } catch (error) {
                res.status(401).send({ error: error.message })
            }
        }
    ];
}

module.exports = authorize;