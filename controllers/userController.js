require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userRepository = require('../repositories/userRepository.js');

module.exports = {
    login: async function (req, res) {
        try {
            const user = await User.checkValidCredentials(req.body.email, req.body.password);
            if (user) {
                user.newAuthToken();
                res.cookie('token', user.token, { maxAge: 3600000, secure: true, httpOnly: true });
                res.redirect('/')
            }
            else {
                res.redirect('/login');
            }
        } catch (error) {
            res.redirect('/login');
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
    saveAvatar: async function (req, res) {
        try {
            const token = req.cookies.token;
            const decoded = jwt.decode(token);

            const user = await User.findOneAndUpdate({ _id: decoded._id }, { avatar: req.file.filename }, {
                returnOriginal: false
            });

            res.send(req.file)
        } catch (error) {
            console.log(error.message)
            res.status(400).send({ error: error.message })
        }
    },
    currentUser: async function (req, res) {
        try {
            const token = req.cookies.token;
            const decoded = jwt.decode(token);
            const users = await userRepository.getUser(decoded._id);
            res.status(200).json(users);
        } catch (error) {
            console.log(error)
            res.status(501).send(error);
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
    getFriendRequests: async function (req, res) {
        try {
            const token = req.cookies.token;
            const decoded = jwt.decode(token)

            const firendReuests = await userRepository.getFriendRequests(decoded._id);
            res.status(200).json(firendReuests);
        } catch (error) {
            console.log(error)
            res.status(501).send(error);
        }
    },
    acceptFriend: async function (req, res) {
        try {
            const token = req.cookies.token;
            const decoded = jwt.decode(token)
            const response = await userRepository.acceptFriend(decoded._id, req.body.senderId.toString());
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
            res.status(501).send(error);
        }
    },
    rejectFriend: async function (req, res) {
        try {
            const token = req.cookies.token;
            const decoded = jwt.decode(token)
            const response = await userRepository.rejectFriend(decoded._id, req.body.senderId.toString());
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
            res.status(501).send(error);
        }
    },
    getDiseases: async function (req, res) {
        try {
            const response = await userRepository.getDiseases();
            res.render('diseases', response);
        } catch (error) {
            console.log(error)
            res.status(501).send(error);
        }
    },
    addDisease: async function (req, res) {
        try {
            const response = await userRepository.addDisease(req.body.name);
            res.render('diseases', response);
        } catch (error) {
            console.log(error)
            res.status(501).send(error);
        }
    },
    deleteDisease: async function (req, res) {
        try {
            console.log('diseaseId ' + req.param.diseaseId)
            const response = await userRepository.deleteDisease(req.param.diseaseId);
            res.render('diseases', response);
        } catch (error) {
            console.log(error)
            res.status(501).send(error);
        }
    },
    addSubDisease: async function (req, res) {
        try {
            const response = await userRepository.addSubDisease(req.body.subdiseaseid, req.body.name);
            res.render('diseases', response);
        } catch (error) {
            console.log(error)
            res.status(501).send(error);
        }
    },
    getDisease: async function (req, res) {
        try {
            const response = await userRepository.getDisease(req.param.id);
            res.render('editDisease', response);
        } catch (error) {
            console.log(error)
            res.status(501).send(error);
        }
    },
    editDisease: async function (req, res) {
        try {
            const response = await userReposiytor.editDisease(req.param.id, req.body.name);
            res.render('editDisease', response);
        } catch (error) {
            console.log(error)
            res.status(501).send(error);
        }
    },
    logOut: async function (req, res) {
        try {
            const token = req.cookies.token;
            const decoded = jwt.decode(token)
            await userRepository.logOut(decoded._id);
            res.cookie("token", '');
            res.redirect('/login')
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    }
}