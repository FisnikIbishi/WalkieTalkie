require('dotenv').config()
var mongoose = require('mongoose');
const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');
const Friend = require('../models/friend');
const Message = require('../models/message');

module.exports = {
    getData: async function (userId) {
        const user = await User.findById(userId, { __v: 0, password: 0, token: 0 });
        const contacts = await Friend.find({ user_id: userId }, { __v: 0 }).populate('friend_id', '_id username email');
        const messages = await Message.find( { recipient: userId }, { __v: 0 })
            .populate('sender', '_id username email')
            .populate('recipient', '_id username email');
        return {
            data: {
                user: user,
                contacts: contacts,
                messages: messages
            }
        }
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