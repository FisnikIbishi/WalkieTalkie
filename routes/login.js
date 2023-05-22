const express = require('express');
var userController = require('../controllers/userController.js');
const router = express.Router();
const authorize = require('../middlewares/authMiddleware');

router.get('/login', authorize(), function (req, res) {
    res.render('login');
});

router.post('/login', userController.login);
router.post('/register', authorize(), userController.register);

module.exports = router;