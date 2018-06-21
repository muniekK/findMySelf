const mongoose = require('mongoose');
const dataTables = require('mongoose-datatables')

// User Schema
const schema = mongoose.Schema({
  date:String,
  user:String,
  Q01:String,
  Q02:String,
  Q03:String,
  Q04:String,
  Q05:String,
  Q06:String,
  Q07:String,
  Q08:String,
  Q09:String,
  Q10:String,
  Q11:String,
  Q12:String,
  Q12:String,
  Q13:String,
  notes:String
});

schema.plugin(dataTables)
const Model = module.exports = mongoose.model('desurvey', schema);
