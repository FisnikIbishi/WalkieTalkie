const express = require('express');
const index = require('./public/home/index')

const app = express();

app.use(express.static(__dirname + '/public'));
app.use('/', index);

// start the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});