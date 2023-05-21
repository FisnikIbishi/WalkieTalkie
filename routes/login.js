const express = require('express');
var userController = require('../controllers/userController.js');
const router = express.Router();

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;