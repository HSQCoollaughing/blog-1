var express = require('express');
var auth = require('../middleware/auth');
var models = require('../models');
var multer = require('multer');
var markdown = require('markdown').markdown;
//指定存储的目录和文件名
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1) )
    }
});

var upload = multer({ storage:storage });

var router = express.Router();

router.get('/add', auth.checkLogin,function (req,res,next) {
    res.render('article/add',{article:{}})
});

router.post('/add',auth.checkLogin,upload.single('poster'),function (req,res,next) {
    var article = req.body;
    var _id = article._id;

    if(_id){
        var updateObj = {title:article.title,content:article.content};
        if(req.file){
            updateObj.poster = '/upload/'+req.file.filename;
        }

        models.Article.update({_id:_id},{$set:updateObj}, function (err,doc) {
            if(err){
                req.flash('error','文章更新失败！');
            }else{
                req.flash('success','文章更新成功');
                res.redirect('/');
            }
        })
    }else{
        if(req.file){
            article.poster = '/upload/'+req.file.filename;
        }
        //把当前登录的用户id赋给user
        article.user = req.session.user._id;
        models.Article.create(article,function(err,doc){
            if(err){
                req.flash('error','文章发表失败！');
            }else{
                req.flash('success','文章发表成功');
                res.redirect('/');
            }
        })
    }

});

router.get('/detail/:_id', function (req,res,next) {
    var _id = req.params._id;

    models.Article.update({_id:_id},{$inc:{pv:1}}, function (err,result) {
        models.Article.findById(_id).populate('user').populate('comments.user').exec(function (err,article) {
            article.content = markdown.toHTML(article.content);
            res.render('article/detail',{article:article})
        })
    });
});

router.get('/delete/:_id', function (req,res,next) {
    var _id = req.params._id;

    models.Article.remove({_id:_id}, function (err,result) {
        res.redirect('/');
    })
});

router.get('/edit/:_id', function (req,res) {
    var _id = req.params._id;
    models.Article.findById(_id, function (err,article) {
        res.render('article/add',{article:article});
    })
});

router.post('/comment',auth.checkLogin, function (req,res) {
    var user = req.session.user;
    models.Article.update({_id:req.body._id},{$push:{comments:{user:user._id,content:req.body.content}}}, function (err,result) {
        if(err){
            req.flash('error','评论失败了');
            res.redirect('back');
        }else{
            req.flash('success','评论成功');
            res.redirect('back');
        }
    })
});

module.exports = router;