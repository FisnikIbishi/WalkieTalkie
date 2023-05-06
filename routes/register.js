const express = require('express');
const router = express.Router();

router.get('/register', function (req, res) {
    res.sendFile('index.html', { root: './public/register/html/' });
});

module.exports = router;