require('dotenv').config()
const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');

const bcrypt = require('bcryptjs');

module.exports = {
    getUsers: async function (username) {
        return await User.find({ username: { "$regex": username, "$options": "i" } }, { __v: 0, password: 0, role: 0, token: 0 });
    },
    addFriend: async function (userId, body) {
        const friendRequest = new FriendRequest(
            {
                sender: userId,
                recipient: body.userId,
                status: 'pending'
            }
        );

        friendRequest.save();

        return friendRequest;
    },
    logOut: async function (userId) {
        return await User
            .findOneAndUpdate({ _id: userId }, { token: '' }, { new: true });
    }
}