const express = require('express');
var userController = require('../controllers/userController.js');
const router = express.Router();

router.get('/login', function (req, res) {
    res.sendFile('index.html', { root: './public/login/html/' });
});

router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;