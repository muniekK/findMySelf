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
router.get('/videos/:title', (req, res) => {
  let dbPath = `./staticdb/${req.params.title}.json`;
  //console.log(dbPath)

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) throw err;
    res.json({
      videos: data
    });
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

// server side rendering with mongoose-datatables
// https://github.com/archr/mongoose-datatables 
// https://github.com/archr/mongoose-datatables/blob/master/example/index.js
function getModel(chapter) {
  return {
    'hieu': '../models/hieumodel',
    'de': '../models/demodel',
    'can': '../models/canmodel',
    'tin': '../models/tinmodel',
    'tubi': '../models/tubimodel',
    'thannhan': '../models/thannhanmodel',
    'hocvan': '../models/hocvanmodel'
  }[chapter]
}

router.post('/my-surveys/:chapter', ensureAuthenticated, (req, res) => {
  let username = (req.user) ? req.user.username : "";

  let Model = require(getModel(req.params.chapter)),
    datatablesQuery = require('datatables-query'),
    params = req.body,
    query = datatablesQuery(Model);

  Model.dataTables({
    limit: req.body.length,
    skip: req.body.start,
    order: req.body.order,
    columns: req.body.columns,
    search: {
      value: "(^" + username + "$)",
      fields: ['user']
    },
    sort: {
      date: -1
    }
  }).then(function(table) {
    res.json({
      data: table.data,
      recordsFiltered: table.total,
      recordsTotal: table.total
    });
  })
})

router.get('/my-last-survey/:chapter', (req, res)=>{
  
  let model = require(getModel(req.params.chapter));

  model
    .find({'user':req.user.username})
    .sort({'date': -1})
    .limit(1)
    .exec(function(err, lastSurvey) {
      res.json(lastSurvey)
    })
})

router.post('/group-surveys/:chapter', (req, res)=>{

  let username = (req.user) ? req.user.username:"";

  let Model = require(getModel(req.params.chapter)),
    datatablesQuery = require('datatables-query'),
    params = req.body, 
    query = datatablesQuery(Model);
  
  //https://github.com/archr/mongoose-datatables // https://github.com/archr/mongoose-datatables/blob/master/example/index.js
  Model.dataTables({
    limit: req.body.length,
    skip: req.body.start,
    order: req.body.order,
    columns: req.body.columns,
    search: {},
    sort: {
      date:-1
    }
  }).then(function (table) {
    res.json({
      data:treatGroupRes(table.data),
      recordsFiltered: table.total,
      recordsTotal: table.total
    }); 
  })
})

// hide name but not notes for some user
function treatGroupRes(data){
  var pubUser = ["Triệu"];
  for(i in data) {    
    // order is important
    data[i].notes = (!pubUser.includes((data[i].user))) ?  "": data[i].notes;    
    data[i].user = "private";
  }
  return data;
}
  
router.post('/newSurvey/:chapter', ensureAuthenticated, (req, res) => {
  let instance, newSurvey, nbQuestion = 0;
  switch (req.params.chapter) {
    case 'hieu':
      instance = require('../models/hieumodel');
      nbQuestions = 24;
      break;
    case 'de':
      instance = require('../models/demodel');
      nbQuestions = 13;
      break;
    case 'can':
      instance = require('../models/canmodel');
      nbQuestions = 24;
      break;
    case 'tin':
      instance = require('../models/tinmodel');
      nbQuestions = 15;
      break;
    case 'tubi':
      instance = require('../models/tubimodel');
      nbQuestions = 21;
      break;
    case 'thannhan':
      instance = require('../models/thannhanmodel');
      nbQuestions = 4;
      break;
    case 'hocvan':
      instance = require('../models/hocvanmodel');
      nbQuestions = 13;
      break;
  }

  newSurvey = new instance();

  instance
    .find({
      'user': req.user.username
    })
    .sort({
      'date': -1
    })
    .limit(1)
    .exec(function(err, lastSurvey) {
      if (lastSurvey[0] && lastSurvey[0].date.substring(0, 10).localeCompare(getCurrDate().substring(0, 10)) == 0) {
        res.status(409).json({
          message: 'survey already done for today'
        }); //find the last one of the user to see if its today: only one survey, per one user, per day

      } else {
        newSurvey.date = getCurrDate();
        newSurvey.user = req.user.username;

        for (i = 1; i < nbQuestions + 1; i++) {
          let name = (i < 10) ? 'Q0' + i : 'Q' + i;
          //console.log(req.body['Q01']);
          newSurvey[name] = (req.body[name]) ? req.body[name] : "na"; // default: na
        }

        newSurvey.notes = (req.body.notes) ? req.body.notes : '';

        newSurvey.save(function(err) {
          if (err) {
            res.status(500).json({
              message: 'server error'
            });
          } else {
            res.status(201).json({
              message: 'survey submited'
            });
          }
        })
      }
    });
})

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(400).json({
      message: 'Access Denied. Please login'
    })
    return;
  }
}

module.exports = router;

function getCurrDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  var hour = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();

  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  if (min < 10) {
    min = '0' + min
  }
  if (sec < 10) {
    sec = '0' + sec
  }

  return yyyy + '/' + mm + '/' + dd + " " + hour + ":" + min + ":" + sec;
}