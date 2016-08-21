//用于打印一些调试信息
var debug = require('debug');
console.log(process.env.DEBUG);

var loggerServer = debug('logger:server');
//调用此函数在控制台输出日志
loggerServer('server');
var loggerClient = debug('logger:client');
loggerClient('client');
