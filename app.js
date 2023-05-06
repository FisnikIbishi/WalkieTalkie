const express = require('express');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
const index = require('./routes/index')
const login = require('./routes/login')
const register = require('./routes/register')
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use(index);
app.use(login);
app.use(register);

//Set up default mongoose connection
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('connected to database');
}).catch(() => {
  console.log('failed connected to database');
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});