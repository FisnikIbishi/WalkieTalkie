const express = require('express');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
const index = require('./routes/home');
const login = require('./routes/login');
const register = require('./routes/register');
const disease = require('./routes/disease');
const path = require('path');
const socketIO = require('socket.io');
require('dotenv').config();
const Message = require('./models/message');

const app = express();

app.post('/upload', (req, res) => {
  // Get the file that was set to our field named "image"
  const { image } = req.files;

  // If no image submitted, exit
  if (!image) return res.sendStatus(400);

  // If does not have image mime type prevent from uploading
  if (/^image/.test(image.mimetype)) return res.sendStatus(400);

  // Move the uploaded image to our upload folder
  image.mv(__dirname + '/upload/' + image.name);

  // All good
  res.sendStatus(200);
});

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use(index);
app.use(login);
app.use(register);
app.use(disease);

//Set up default mongoose connection
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('connected to database');
}).catch(() => {
  console.log('failed connected to database');
});

// start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
});

const io = socketIO(server);
// Handle socket connections
io.on('connection', (socket) => {
  console.log('User connected');

  // Receive local stream from the client
  socket.on('stream', stream => {
    // Broadcast the stream to all other clients
    console.log(stream)
    socket.broadcast.emit('stream', stream);
  });

  socket.on('add-friend', id => {
    socket.broadcast.emit(id + '_add-friend', id);
  });

  // Handle incoming chat messages
  socket.on('new_message', (msg) => {
    const newMessage = new Message(
      {
        sender: msg.sender,
        recipient: msg.recvId,
        message: msg.body
      }
    )
    newMessage.save();

    socket.broadcast.emit(msg.recvId + "_new_message", msg);
  });

  socket.on('offer', (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on('answer', (answer) => {
    console.log('answer ' + answer)
    socket.broadcast.emit("answer", answer);
  });

  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('end-call', (state) => {
    socket.broadcast.emit('end-call', state);
  });

  // Handle socket disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});