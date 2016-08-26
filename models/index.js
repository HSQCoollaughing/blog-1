var mongoose = require('mongoose');
var config = require('../config');
var ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.connect(config.dbUrl);

exports.User = mongoose.model('user',new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    avatar:String
}));

exports.Article = mongoose.model('article',new mongoose.Schema({
    user:{
        type:ObjectId,
        ref:'user'
    },
    title:String,
    content:String,
    poster:String,
    createAt:{
        type:Date,
        default:Date.now()
    },
    pv:{type:Number,default:0},
    comments:[
        {
            user:{type:ObjectId,ref:'user'},
            content:String,
            createAt:{type:Date,default:Date.now()}
        }
    ]
}));