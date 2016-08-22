var crypto = require('crypto');

var md5 = crypto.createHash('md5')
    .update('sam')
    .digest('hex');

console.log(md5);