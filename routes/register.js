const express = require('express');
var userController = require('../controllers/userController.js');
const router = express.Router();

router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', userController.register);

module.exports = router;