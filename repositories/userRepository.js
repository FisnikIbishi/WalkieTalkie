require('dotenv').config()
var mongoose = require('mongoose');
const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');
const Friend = require('../models/friend');
const Message = require('../models/message');
const Role = require('../_helpers/role');

module.exports = {
    saveAvatar: async function (userId, avatar) {
        return await User.findOneAndUpdate({ _id: userId }, { avatar: avatar }, {
            returnOriginal: false
        });
    },
    getData: async function (userId) {
        const users = await User.find({}, { __v: 0, password: 0, role: 0, token: 0 });
        const user = await User.findById(userId, { __v: 0, password: 0, token: 0 });
        const contacts = await Friend.find({ user_id: userId }, { __v: 0 }).populate('friend_id', '_id username email avatar');
        const messages = await Message.find(
            {
                $or: [
                    { sender: userId },
                    { recipient: userId }
                ]
            }, { __v: 0 })
            .populate('sender', '_id username email')
            .populate('recipient', '_id username email');

        const data = {
            user: user,
            contacts: contacts,
            messages: messages
        }

        if (user.role == Role.Admin) {
            data.users = users
        }
        else {
            data.users = []
        }

        return { data }
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

        const friend2 = new Friend(
            {
                user_id: senderId,
                friend_id: userId
            }
        )
        friend2.save();

        const newFriend = await User.findOne({ _id: senderId });

        const newMessage1 = new Message(
            {
                sender: userId,
                recipient: senderId,
                message: 'Hello!'
            }
        )
        newMessage1.save();

        const newMessage2 = new Message(
            {
                sender: senderId,
                recipient: userId,
                message: 'Say hi to your new friend!'
            }
        )
        newMessage2.save();

        return { newMessage1: newMessage1, newMessage2: newMessage2, newFriend: newFriend }
    },
    rejectFriend: async function (userId, senderId) {
        await FriendRequest.findOneAndRemove({ recipient: userId, sender: senderId });
        return { message: 'Friend request rejected' }
    },
    saveMessage: async function (message) {
        const newMessage = new Message(
            {
                sender: msg.sender,
                recipient: msg.recvId,
                message: message
            }
        )
        newMessage.save();
        return { message: 'Friend request accepted!' }
    },
    logOut: async function (userId) {
        return await User
            .findOneAndUpdate({ _id: userId }, { token: '' }, { new: true });
    }
}