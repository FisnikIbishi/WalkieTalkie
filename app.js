const express = require('express');
<<<<<<< HEAD
const session = require('express-session');
const index = require('./public/home/index');
=======
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
const index = require('./routes/index')
const login = require('./routes/login')
const register = require('./routes/register')
require('dotenv').config();
>>>>>>> 53bfafdeac39a294b23b9772fd3d179cf5a04cad

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
<<<<<<< HEAD

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/', isLoggedIn, (req, res) => {
  res.render('home');
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

app.use('/', index);
=======
app.use(index);
app.use(login);
app.use(register);

//Set up default mongoose connection
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('connected to database');
}).catch(() => {
  console.log('failed connected to database');
});
>>>>>>> 53bfafdeac39a294b23b9772fd3d179cf5a04cad

// start the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Verify the user's credentials
    // ...
  
    // Store the username in the session
    req.session.username = username;
  
    // Redirect to the home page
    res.redirect('/home');
  });
  
  app.get('/home', (req, res) => {
    const username = req.session.username;
  
    // Set the name property of the user object to the value of the username
    user.name = username;
  
    // Render the home page and pass the user object to the template
    res.render('home', { user: user });
  });
  

  