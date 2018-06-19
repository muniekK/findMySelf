// https://google.github.io/styleguide/jsguide.html#formatting-comments

const express = require('express');
const router = express.Router();

const fs = require('fs');
const async = require('async');

router.get('/', (req, res) => {
  res.render('dtq');
});


/**
 * @param {string} : dtq40, dtq60, dtq120, nlntt, thpt
 */
router.get('/videos/:title', (req, res)=>{
  let dbPath = `./staticdb/${req.params.title}.json`;
  console.log(dbPath)
  
  fs.readFile(dbPath, 'utf8', (err, data)=>{
    if (err) throw err;
    res.json({videos:data});  
  })
})

router.get('/theory', (req, res) => {
  async.parallel([
      function(callback) {
        fs.readFile('./staticdb/dtqTheory.json', 'utf8', (err, data) => {
          if (err) throw err;
          callback(null, data);
        })
      },
      function(callback) {
        fs.readFile('./staticdb/dtq120.json', 'utf8', (err, data) => {
          if (err) throw err;
          callback(null, data);
        })
      },
      function(callback) {
        fs.readFile('./staticdb/nlntt.json', 'utf8', (err, data) => {
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