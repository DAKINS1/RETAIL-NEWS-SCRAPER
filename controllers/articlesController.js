// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Requiring our Note and Article models
var Comment = require("../models/comment.js");
var Article = require("../models/article.js");


module.exports = function (app) {

      app
    .get('/', function (req, res) {
      res.redirect('/articles');
    });

app.get("/scrape", function(req, res) {

    request("https://www.cnbc.com/retail/", function(error, response, html) {

    var $ = cheerio.load(html);

    $(".headline").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.snippet = $(this).siblings().siblings().siblings("p.desc").text();

      var entry = new Article(result);

      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      }); //entry.save closure
    }); //$headline closure

  }); //request closure


    // Tell the browser that we finished scraping the text
    res.redirect("/");
  });

app.get("/articles", function(req, res) {

  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      // res.json(doc);
      res.render("index", {result: doc});
    }
  })
    .sort({'_id': -1});
});


app.get("/articles/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate("comment")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.render("comments", {result: doc});
    }
  });
});


app.post("/articles/:id", function(req, res) {
    Comment
      .create(req.body, function (error, doc) {
        // Log any errors
        if (error) {
          console.log(error// Otherwise
          );
        } else {
          // Use the article id to find and update it's comment
          Article.findOneAndUpdate({
            "_id": req.params.id
          }, {
            $push: {
              "comment": doc._id
            }
          }, {
            safe: true,
            upsert: true,
            new: true
          })
          // Execute the above query
            .exec(function (err, doc) {
              // Log any errors
              if (err) {
                console.log(err);
              } else {
                // Or send the document to the browser
                res.redirect('back');
              }
            });
        }
      });
});

  app.delete("/articles/:id/:commentid", function (req, res) {
    Comment
      .findByIdAndRemove(req.params.commentid, function (error, doc) {
        // Log any errors
        if (error) {
          console.log(error// Otherwise
          );
        } else {
          console.log(doc);
          Article.findOneAndUpdate({
            "_id": req.params.id
          }, {
            $pull: {
              "comment": doc._id
            }
          })
          // Execute the above query
            .exec(function (err, doc) {
              // Log any errors
              if (err) {
                console.log(err);
              }
            });
        }
      });
  });

};