const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
var homeController = require('../controllers/homeController.js');

router.get('/', authorize(), homeController.home);

module.exports = router;