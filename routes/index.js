var express = require('express');
var models = require('../models');
var markdown = require('markdown').markdown;

var router = express.Router();

router.get('/', function(req, res, next) {

  models.Article.find({}).populate('user').exec(function (err,articles) {
    articles.forEach(function (article) {
        article.content = markdown.toHTML(article.content);
    });

    res.render('index', { title: '我的博客', articles: articles });
  });

});

module.exports = router;