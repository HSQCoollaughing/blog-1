var express = require('express');
var router = express.Router();

router.get('/add', function (req,res,next) {
    res.send('发表文章');
});

module.exports = router;