var express = require('express');
var auth = require('../middleware/auth');
var models = require('../models');
var multer = require('multer');
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
    res.render('article/add',{})
});

router.post('/add',auth.checkLogin,upload.single('poster'),function (req,res,next) {
    var article = req.body;

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
});

module.exports = router;