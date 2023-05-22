require('dotenv').config();
const User = require('../models/user');
const userRepository = require('../repositories/userRepository.js');

module.exports = {
    login: async function (req, res) {
        try {
            console.log('Bodyy: ' + req.body.email)
            const user = await User.checkValidCredentials(req.body.email, req.body.password);
            console.log('tokeeeen: ' + user.token)
            res.cookie('token', user.token, { maxAge: 3600000, secure: true, httpOnly: true });
            res.redirect('/')
        } catch (error) {
            res.status(400).json({ message: error });
        }
    },
    register: async function (req, res) {
        const user = new User(req.body);
        user.newAuthToken();
        res.status(200).json({ id: user.id, email: user.email, description: user.description, token: user.token })
    },
    logOut: async function (req, res) {
        try {
            await userRepository.logOut(req.user._id);
            res.status(200).json({ message: 'User logged out successfully!' })
        } catch (error) {
            res.status(500).send(error)
        }
    }
}