const express = require('express');
var userController = require('../controllers/userController.js');
const router = express.Router();
const authorize = require('../middlewares/authMiddleware');

router.get('/register', authorize(), function (req, res) {
    res.render('register');
});

router.post('/register', userController.register);

module.exports = router;