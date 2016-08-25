var express = require('express');
var models = require('../models');
var markdown = require('markdown').markdown;

var router = express.Router();

/*
* 分页 传参 当前页码  每页的条数
* 结果 当页的数据 一共多少页  当前页码  每页的条数
* */

router.get('/', function(req, res, next) {
    var keyword = req.query.keyword;
    var search = req.query.search;
    var pageNum = parseInt(req.query.pageNum) || 1;    //当前页码
    var pageSize = parseInt(req.query.pageSize) || 2;  //每页条数
    var queryObj = {};
    //点击提交按钮过来的
    if(search){
        req.session.keyword = keyword;
    }

    keyword = req.session.keyword;
    var reg = new RegExp(keyword,'i');
    queryObj = {$or:[{title:reg},{content:reg}]};


    models.Article.find(queryObj).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function (err,articles) {

        articles.forEach(function (article) {
            article.content = markdown.toHTML(article.content);
        });
        //取得这个条件有多少条符合的数据
        models.Article.count(queryObj, function (err,count) {
            res.render('index', {
                title: '我的博客',
                articles: articles,
                totalPage:Math.ceil(count/pageSize),
                pageNum:pageNum,
                pageSize:pageSize,
                keyword:keyword
            });
        });

    });

});

module.exports = router;