const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');


const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/database');

mongoose.connect(db.mongoURI);

let dbInstance = mongoose.connection;

dbInstance.once('open', ()=>{
    console.log('Connected to MongoDB ' + db.mongoURI);
});

dbInstance.on('error', (err)=>{
    console.log(err);
});

// Load Routes
const dtq = require('./routes/dtq');
const users = require('./routes/users');
const main = require('./routes/main');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// PUG middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express Session Middleware
app.use(session({
  secret: db.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {expires: new Date(253402300000000)}  // Approximately Friday, 31 Dec 9999 23:59:59 GMT
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use(function(req, res, next){
  res.locals.user = req.user || null; // use in front end register/login & logout
  next();
});

// index Route
app.get('/', (req, res) => {
  res.render('dtq');
});

// use Routes
app.use('/dtq', dtq)
app.use('/users', users);
app.use('/', main);

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Server live on port ${port}`)
});