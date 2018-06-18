const express = require('express');
const router = express.Router();

const fs = require('fs');
const async = require('async');

router.get('/', (req, res) => {
  res.render('dtq');
});

router.get('/theory', (req, res) => {
  async.parallel([
      function(callback) {
        fs.readFile('./staticdb/dtq_theory.json', 'utf8', (err, data) => {
          if (err) throw err;
          callback(null, data);
        })
      },
      function(callback) {
        fs.readFile('./staticdb/dtq_120.json', 'utf8', (err, data) => {
          if (err) throw err;
          callback(null, data);
        })
      },
      function(callback) {
        fs.readFile('./staticdb/dtq_nlntt.json', 'utf8', (err, data) => {
          if (err) throw err;
          callback(null, data);
        })
      }
    ],
    function(err, data) {
      res.json({
        title: 'theory and videos links for dtq',
        dtqTheory: data[0],
        dtq120: data[1],
        nlntt: data[2]
      })
    });
})

module.exports = router;