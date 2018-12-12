// dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

// models folder
var db = require("./models");

// port
var PORT = 3000;

// initialize express
var app = express();

// handlebars as default templating engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// middleware

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// morgan logger to log requests
app.use(logger("dev"));
// JSON for body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// public is a static folder
app.use(express.static("public"));

// connect to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScrape";

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true }
);

// routes

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get route (scraping the site)
app.get("/scrape", function(req, res) {
  axios.get("https://www.theonion.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("div.post-wrapper").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .find("h1.headline")
        .text();
      result.summary = $(this)
        .find("div.excerpt")
        .text();
      result.link = $(this)
        .find("a.js_entry-link")
        .attr("href");
      result.image = $(this)
        .find("img")
        .attr("src");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Scrape Finished! Return to the splash page to see the articles.");
  });
});

// get route for articles from db
app.get("/articles", function(req, res) {
  db.Article.find({}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});

// get route for a specific article by id/populate with comment
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// post route for saving/updating an article's associated note
app.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body).then(function(dbComment) {
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { comment: dbComment.id } },
      { new: true }
    )
      .then(function(dbComment) {
        res.json(dbComment);
      })
      .catch(function(err) {
        res.json(dbComment);
      });
  });
});

// server start/listening
app.listen(process.env.PORT || PORT, function() {
  console.log("Listening on port: " + PORT);
});
