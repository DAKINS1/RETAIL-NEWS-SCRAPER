var express = require("express");
var handlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;


var app = express();
var PORT = process.env.PORT || 5000;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/retailNews");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

require("./controllers/articlesController.js")(app);

app.listen(PORT, function() {
  console.log("App running on port 5000!");
});
