var express = require('express');
var router = express.Router();

router.get('/add', function (req,res,next) {
    res.send('添加')
});

module.exports = router;