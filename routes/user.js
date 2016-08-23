var express = require('express');
var models = require('../models');
var util = require('../util');
var auth = require('../middleware/auth');
//路由的实例
var router = express.Router();
//注册
router.get('/reg',auth.checkNotLogin ,function (req,res,next) {
    res.render('user/reg',{})
});

router.post('/reg', auth.checkNotLogin,function (req,res,next) {
    var user = req.body;
    if(user.password !=user.repassword){
        res.redirect('back');
    }else{
        req.body.password  = util.md5(req.body.password);
        //增加一个用户头像
        req.body.avatar = 'http://secure.gravatar.com/avatar/'+util.md5(req.body.email)+'?s=48';

        models.User.create(user, function (err,doc) {
            if(err){
                req.flash('error','注册失败');
            }else{
                req.flash('success','注册成功');
                res.redirect('/user/login');
            }
        })
    }
});
//登录
router.get('/login', auth.checkNotLogin, function (req,res,next) {
    res.render('user/login')
});

router.post('/login', auth.checkNotLogin, function (req,res,next) {

    req.body.password  = util.md5(req.body.password);

    //用findOne查找，就一条数据效率更高一些
    models.User.findOne({
        username:req.body.username,
        password:req.body.password
    }, function (err,doc) {
        if(err){
            req.flash('error','用户登录失败');
            res.redirect('back');
        }else{
            if(doc){            //找到用户，表示登录成功
                req.session.user=doc;
                req.flash('success','用户登录成功');
                res.redirect('/')
            }else{
                req.flash('error','用户登录失败');
                res.redirect('back');
            }
        }
    })
});
//退出
router.get('/logout',auth.checkLogin,function (req,res,next) {
    req.session.user = null;
    req.flash('success','用户退出成功');
    res.redirect('/');
});

module.exports = router;
