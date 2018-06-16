const express   = require('express');
const router  = express.Router();

router.get('/', (req, res)=>{
  console.log('dtq - homepage');
  res.render('dtq');
});

module.exports = router;