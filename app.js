var app = require('./app/GameController');
var config = require('./utils/config');
console.log('服务器启动成功！监听端口：' + config.server.port);
app.listen(config.server.port);
