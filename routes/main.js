const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/feedback', (req, res) => {
  res.render('feedback');
})

router.post('/feedback', (req, res) => {
  let Comment = require('../models/commentmodel');
  let newComment = new Comment({
    date: getCurrDate(),
    comment: req.body.comment
  });

  console.log(newComment);

  Comment.newComment(newComment, (err, comment)=>{
    if (err) {
      res.status(500).json({
        message: 'server error'
      });
    } else {
      res.status(201).json({
        message: 'comment submited'
      });
    }
  })
})

module.exports = router;

function getCurrDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  var hour = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();

  (dd < 10) ? dd = '0' + dd : "";   
  (mm < 10) ? mm = '0' + mm : "";  
  (hour < 10) ? hour = '0' + hour : "";  
  (min < 10) ? min = '0' + min : "";  
  (sec < 10) ? sec = '0' + sec : "";

  return yyyy + '/' + mm + '/' + dd + " " + hour + ":" + min + ":" + sec;
}