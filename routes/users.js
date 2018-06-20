const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.post('/register', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  let errors = [];

  (username == "") ? errors.push({ text: 'Username cannot be empty' }): "";
  (password.length < 1) ? errors.push({ text: 'Password must be at least 1 characters' }): "";
  (password != password2) ? errors.push({ text: 'Passwords do not match' }): "";
  (email != "" && !isEmailValid(email)) ? errors.push({ text: 'email is invalid' }): "";

  if (errors.length > 0) {
    res.status(400).json({
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  } else {

    User.findOne({
      username: username
    }, function(err, user) {
      if (user) {
        res.status(409).json({
          'msg': 'ressource already exists'
        });
      } else {
        let newUser = new User({
          joinDate: getCurrDate(),
          name: name,
          email: email,
          username: username,
          password: password
        });
        newUser.save(function(err) {
          if (err) {
            res.status(500).json({
              'msg': 'server error'
            });
            return;
          } else {
            res.status(201).json(newUser);
          }
        });
      }
    })
  }
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
  // If authentication was successful.`req.user` contains the authenticated user. Then you can send your json as response.
  (req.user) ? res.status(202).json(req.user): res.send(401);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

function getCurrDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  var hour = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();

  (dd < 10) ? dd = '0' + dd:"";
  (mm < 10) ?  mm = '0' + mm:"";
  (hour < 10) ? hour = '0' + hour:"";
  (min < 10) ? min = '0' + min:"";
  (sec < 10) ? sec = '0' + sec:"";

  return `${yyyy}/${mm}/${dd} ${hour}:${min}:${sec}`;
}

function isEmailValid(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}