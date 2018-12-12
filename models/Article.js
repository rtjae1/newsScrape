var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  link: {
    type: String
  },
  image: {
    type: String
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

var article = mongoose.model("Article", articleSchema);

module.exports = article;
