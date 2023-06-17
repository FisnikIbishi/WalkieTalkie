require('dotenv').config()
var mongoose = require('mongoose');
const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');
const Friend = require('../models/friend');

module.exports = {
    getUser: async function (userId) {
        console.log(userId)
        return await User.findById(userId, { __v: 0, password: 0, token: 0 });
    },
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
    getFriendRequests: async function (userId) {
        return await FriendRequest.find({ recipient: userId }, { __v: 0, created_at: 0, recipient: 0 })
            .populate('sender', 'username avatar');
    },
    acceptFriend: async function (userId, senderId) {
        await FriendRequest.findOneAndRemove({ recipient: userId, sender: senderId });
        const friend = new Friend(
            {
                user_id: userId,
                friend_id: senderId
            }
        )
        friend.save();
        return { message: 'Friend request accepted!' }
    },
    rejectFriend: async function (userId, senderId) {
        await FriendRequest.findOneAndRemove({ recipient: userId, sender: senderId });
        return { message: 'Friend request rejected' }
    },
    logOut: async function (userId) {
        return await User
            .findOneAndUpdate({ _id: userId }, { token: '' }, { new: true });
    }
}