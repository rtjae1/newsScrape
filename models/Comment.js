var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    title: String,
    body: String
});

var comment = mongoose.model("Comment", commentSchema);

module.exports = comment;