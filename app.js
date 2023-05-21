const express = require('express');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
const index = require('./routes/home');
const login = require('./routes/login');
const register = require('./routes/register');
const path = require('path');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

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
const server = app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});

const io = socketIO(server);
// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle incoming chat messages
    socket.on('new_message', (msg) => {
        console.log(`Message: ${msg}`);
        // Broadcast the message to all connected clients
        socket.broadcast.emit("new_message", msg);
    });

    // Handle socket disconnections
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});