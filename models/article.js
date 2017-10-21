var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  snippet: {
    type: String,
    required: false,
    unique: true
  },
  comment: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
  ]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
