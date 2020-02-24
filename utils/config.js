var path = require('path');
exports.mysql = {
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'dule',
    port: 3306
};
exports.server = {
    port: 8765,
    rootPath: path.resolve(__dirname, '../'),
    htmlPath: path.resolve(__dirname, '../html')
};
exports.api = {
    url: 'http://localhost:8000'
};
