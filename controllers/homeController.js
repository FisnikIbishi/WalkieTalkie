require('dotenv').config();

module.exports = {
    home: async function (req, res) {
        res.render('home');
    }
}