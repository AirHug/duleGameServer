// 加密内容：
// 第一部分：{ room_no : 888888, player : player_id, ip : 192.168.1.1 }
// 加密步骤
// 1. json -> string
// 2. string -> md5
// 3. json + { md5 : '' } ->
var crypto = require('crypto');
var salt = {salt: "ro7zUUt6uUJbN/SFQZEPePJMfJGU7X4JyFtE+QvzZZbo/"};

function createToken(player) {
    var result = JSON.stringify(Object.assign(player, salt));
    return md5(result)
}

function checkToken(player, token) {
    return token === createToken(player)
}

exports.checkToken = checkToken;
exports.createToken = createToken;

function md5(content) {
    var md5 = crypto.createHash('md5');
    md5.update(content);
    return md5.digest('hex');
}
