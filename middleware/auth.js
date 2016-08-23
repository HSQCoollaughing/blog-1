
exports.checkLogin = function (req,res,next) {
    if(req.session.user){
        next();
    }else{
        req.flash('error','必须登录后才能访问');
        res.redirect('/user/login');
    }
}

exports.checkNotLogin = function (req,res,next) {
    if(req.session.user){
        req.flash('success','必须登录前访问');
        res.redirect('/');
    }else{
        next();
    }
}