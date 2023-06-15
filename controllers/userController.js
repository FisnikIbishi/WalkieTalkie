require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userRepository = require('../repositories/userRepository.js');

module.exports = {
    login: async function (req, res) {
        try {
            const user = await User.checkValidCredentials(req.body.email, req.body.password);
            res.cookie('token', user.token, { maxAge: 3600000, secure: true, httpOnly: true });
            res.redirect('/')
        } catch (error) {
            res.status(400).json({ message: error });
        }
    },
    register: async function (req, res) {
        try {
            const user = new User(req.body);
            user.newAuthToken();
            res.redirect('/');
        } catch (error) {
            res.status(400).json({ message: error });
        }
    },
    getUsers: async function (req, res) {
        try {
            const users = await userRepository.getUsers(req.params.username);
            res.status(200).json(users);
        } catch (error) {
            res.status(501).send(error);
        }
    },
    addFriend: async function (req, res) {
        try {
            const token = req.cookies.token;
            const decoded = jwt.decode(token)
    
            await userRepository.addFriend(decoded._id, req.body);
            res.status(201).json({ message: 'Friend request sent!' });
        } catch (error) {
            console.log(error)
            res.status(501).send(error);
        }
    },
    logOut: async function (req, res) {
        try {
            await userRepository.logOut(req.user._id);
            res.status(200).json({ message: 'User logged out successfully!' });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}