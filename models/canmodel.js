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
  Q14:String,
  Q15:String,
  Q16:String,
  Q17:String,
  Q18:String,
  Q19:String,
  Q20:String,
  Q21:String,
  Q22:String,
  Q23:String,
  Q24:String,
  notes:String
});

schema.plugin(dataTables)
const Model = module.exports = mongoose.model('cansurvey', schema);
