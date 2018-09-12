const mongoose = require('mongoose');
const dataTables = require('mongoose-datatables')

// User Schema
const schema = mongoose.Schema({
  date:String,
  comment:String
});

schema.plugin(dataTables)
const Model = module.exports = mongoose.model('comment', schema);

module.exports.newComment = function(newComment, callback) {
  newComment.save(callback);
};

