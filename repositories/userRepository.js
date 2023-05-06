require('dotenv').config()
const User = require('../models/user');

const bcrypt = require('bcryptjs');

module.exports = {
    logOut: async function (userId) {
        return await User
            .findOneAndUpdate({ _id: userId }, { token: '' }, { new: true });
    }
}