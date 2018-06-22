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
  notes:String
});
schema.plugin(dataTables)
const Model = module.exports = mongoose.model('thannhansurvey', schema);
