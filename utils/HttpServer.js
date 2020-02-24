var config = require('./config');
var app = require('express')();

// 欢迎页面
app.get('/', function (req, res) {
    res.sendFile(config.server.htmlPath + '/index.html');
});

app.get('/test', function (req, res) {
    res.sendFile(config.server.htmlPath + '/test.html');
});

module.exports = app;
