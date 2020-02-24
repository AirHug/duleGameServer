class Socket {
    constructor(socket) {
        this.socket = socket
    }

    initSocket() {
        // 获取游戏信息
        this.socket.on('getGameHandData', function () {

        });
        // 获取游戏信息
        this.socket.on('reconnectRoom', function () {

        });
        // 获取游戏信息
        this.socket.on('setReadyState', function () {

        });
    }
}

exports.Socket = Socket;
