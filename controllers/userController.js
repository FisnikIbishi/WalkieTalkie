require('dotenv').config();
const User = require('../models/user');
const userRepository = require('../repositories/userRepository.js');

module.exports = {
    login: async function (req, res) {
        try {
            const user = await User.checkValidCredentials(req.body.email, req.body.password);
            //await user.newAuthToken()
            console.log(user.username)
            res.status(200).json(
                {
                    id: user._id,
                    username: user.name,
                    email: user.email,
                    description: "Description..."
                });
        } catch (error) {
            res.status(400).json({ message: error })
        }
    },
    register: async function (req, res) {
        const user = new User(req.body);
        const token = user.newAuthToken();
        res.status(200).json({ token: token })
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