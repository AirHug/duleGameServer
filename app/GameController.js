let server = require('http').Server(require('../utils/HttpServer'));
let io = require('socket.io')(server);
let db = require('../../utils/db');
let YHWHSocket = require('./yhwh/Server').Server;
let RoomFactory = require('./RoomFactory').RoomFactory;

let players = {};
let rooms = {};

let classify_rooms = {};

io.on('connection', function (socket) {
    let original = null;
    let player = null;
    let room = null;
    let cheater = false;

    // 上传玩家原始信息
    socket.on("submitPlayerInfo", function (data) {
        if (typeof (data) === 'string') {
            data = JSON.parse(data)
        }
        original = data;
        if (players[original.id] !== undefined) {
            // 有人登录中
            console.log('有人登录中');
            socket.disconnect();
            return;
        }
        players[original.id] = original;
        db.completePlayerInfo(original.id, original.token).then((res) => {
            if (res.length === 0) {
                // token 有误
                console.log('token 有误');
                socket.disconnect();
            } else {
                cheater = res[0].is_cheater === 1
            }
        })
    });

    // 断开链接
    socket.on("disconnect", function () {
        delete players[original.id];
        if (room !== null) {
            room.onPlayerLeave(original);
            socket.to(object.roomNo).emit('roomData', room.getRoomData());
            // 尝试关闭房间
            if (room.tryClose()) {
                delete rooms[room.room_no];
            }
        }
    });

    // ping
    socket.on('game_ping', function () {
        socket.emit('game_pong')
    });

    // 获取在线游戏玩家数量
    socket.on('getPlayerCount', function () {
        socket.emit('player_count', Object.keys(players).length)
    });

    // 获取房间信息
    socket.on("getRoomData", function () {
        socket.emit('roomData', room.getRoomData())
    });

    // 创建房间
    socket.on('createRoom', function (config) {
        if (typeof (config) == 'string') {
            config = JSON.parse(config)
        }
        let room_no;
        while (true) {
            room_no = Math.floor((Math.random() + 1) * 100000);
            if (rooms[room_no] === undefined) {
                let factory = new RoomFactory(room_no, config);
                rooms[room_no] = factory.getRoom();
                room = factory.getRoom();
                classify_rooms[config.type] = factory.getRoom();
                break;
            }
        }
        room.createAndJoinRoom(original).then((res) => {
            player = res.player;
            socket.join(res.room_no);
            socket.emit('joinResult', {status: 200, result: {room_no: res.room_no}});
        });
    });

    // 加入房间
    socket.on('joinRoom', function (room_no) {
        if (rooms[room_no] === undefined) {
            socket.emit('joinResult', {status: 300, msg: '房间不存在！'});
        } else {
            player = rooms[room_no].onPlayerJoin(original);
            if (player === null) {
                socket.emit('joinResult', {status: 300, msg: '房间已满！'});
            } else {
                socket.join(room_no);
                room = rooms[room_no];
                socket.emit('joinResult', {status: 200, result: {room_no: room_no}});
                socket.to(room_no).emit('roomData', room.getRoomData())
            }
        }
    });

    // 离开房间
    socket.on('leaveRoom', function () {
        if (room === null) {
            socket.emit('gameError', '玩家不在任何房间。');
        } else {
            room.onPlayerLeave(original);
            socket.leave(room.room_no);
            player = null;
            socket.to(room.room_no).emit('roomData', room.getRoomData());
            // 尝试关闭房间
            if (room.tryClose()) {
                delete rooms[room.room_no];
                delete classify_rooms[room.config.type][room.room_no];
            }
        }
    });
});

module.exports = server;
