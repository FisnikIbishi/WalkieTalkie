const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
var homeController = require('../controllers/homeController.js');
var userController = require('../controllers/userController.js');

router.get('/', authorize(), homeController.home);
router.get('/api/users/:username', authorize(), userController.getUsers);
router.post('/api/users', authorize(), userController.addFriend);

module.exports = router;