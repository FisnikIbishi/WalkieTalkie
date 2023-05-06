const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.sendFile('index.html', { root: './public/home/html/' });
});

module.exports = router;