let {Room} = require('./Room');
let db = require('../../utils/db');

class Server {

    constructor(io) {
        this.name = '/yhwh';
        this.io = io;
        this.skt = this.io.of(this.name);
        this.rooms = {};
        this.players = {};
        this.player_count = 0;
        this.initSocket()
    }

    initSocket() {
        let gameServer = this;
        this.skt.on('connection', function (socket) {
            // 链接私有变量
            let object = {
                player_original: null,
                player: null,
                is_cheater: null,
                roomNo: null,
                room: null,
                timer: null
            };

            // 逃跑回调
            function escapeTimerFunction() {
                if (object.roomNo !== null) {
                    let room = gameServer.rooms[object.roomNo];
                    if (room.game.roundGaming) {
                        socket.to(room.room_no).emit('playerRoundStart', room.game.playerRoundIndex);
                        socket.emit('playerRoundStart', room.game.playerRoundIndex);
                    }
                }
            }

            // 获取游戏信息
            socket.on("getGameHandData", function () {
                if (object.roomNo !== null) {
                    socket.emit('gameData', gameServer.rooms[object.roomNo].getGameData(object.player_original.id))
                }
            });

            // 断线重连游戏信息
            socket.on("getGameReconnectData", function () {
                if (object.roomNo !== null) {
                    socket.emit('roomData', gameServer.rooms[object.roomNo].getRoomData())
                }
            });

            // 玩家准备状态
            socket.on('setReadyState', function (flag) {
                object.player.is_ready = flag;
                gameServer.rooms[object.roomNo].tryStartGame(socket, function (canStart, rm) {
                    if (canStart) {
                        rm.startGame();

                        let gameRoundData = {
                            // 是否为第一回合
                            firstRound: true,
                            // 是否为第一回合
                            playerFirstRound: true,
                            // 摇张
                            randomMahjong: rm.game.randomMahjong,
                            // 圈数
                            circleNumber: rm.game.circleNumber,
                            // 小局数
                            topGameRoundNumber: rm.game.topGameRoundNumber,
                            subGameRoundNumber: rm.game.subGameRoundNumber,
                            // 庄家座位
                            gameMasterIndex: rm.game.gameMasterIndex,
                            // 玩家回合
                            playerRoundIndex: rm.game.playerRoundIndex,
                            // 牌山余牌
                            remain: rm.game.mahjongBank.length,
                            roomData: rm.getRoomData(),
                        };


                        socket.to(rm.room_no).emit('gameStart', gameRoundData);
                        socket.emit('gameStart', gameRoundData);

                        object.timer = setTimeout(escapeTimerFunction, 3500);
                    }
                });
                socket.to(object.roomNo).emit('roomData', gameServer.rooms[object.roomNo].getRoomData());
                socket.emit('roomData', gameServer.rooms[object.roomNo].getRoomData());
            });

            // 回合开始
            socket.on('startMyRound', function () {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    if (room.game.drop_mahjong === null) {
                        room.game.getCurrentRoundPlayer().draw();
                        socket.emit('playerRoundPeriod2', room.game.getCurrentPlayerSecondPeriodData());
                        socket.to(room.room_no).emit('playerDraw', {index: room.game.playerRoundIndex});
                    } else {
                        let tmp = room.game.getCurrentPlayerFirstPeriodData();
                        if (tmp.rod.length === 0 && tmp.touch.length === 0 && tmp.replace.length === 0) {
                            room.game.getCurrentRoundPlayer().draw();
                            socket.emit('playerRoundPeriod2', room.game.getCurrentPlayerSecondPeriodData());
                            socket.to(room.room_no).emit('playerDraw', {index: room.game.playerRoundIndex});
                        } else {
                            socket.emit('playerRoundPeriod1', tmp);
                        }
                    }
                    // 开启计时器
                }
            });

            // 吃
            socket.on('touch', function (data) {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    room.game.getCurrentRoundPlayer().touch();
                    socket.emit("afterTouch", room.game.getCurrentRoundPlayer().getGameInformation(true));
                    socket.emit("playerRoundPeriod2", room.game.getCurrentPlayerSecondPeriodData());
                    socket.to(room.room_no).emit('playerTouch', {
                        index: room.game.playerRoundIndex,
                        hand: object.player.getGameInformation(false)
                    });
                }
            });

            // 替
            socket.on('replace', function (data) {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    if (typeof (data) == 'string') {
                        data = JSON.parse(data)
                    }
                    room.game.getCurrentRoundPlayer().replace(data);
                    socket.emit("afterReplace", room.game.getCurrentRoundPlayer().getGameInformation(true));
                    socket.emit("afterPeriod2Operation", {
                        hand: object.player.getGameInformation(true),
                        operationsData: room.game.getCurrentPlayerSecondPeriodData()
                    });
                    socket.to(room.room_no).emit('playerReplace', {
                        index: room.game.playerRoundIndex,
                        hand: object.player.getGameInformation(false)
                    });
                }
            });

            // 弃牌替换
            socket.on('dropReplace', function (data) {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    if (typeof (data) == 'string') {
                        data = JSON.parse(data)
                    }
                    room.game.getCurrentRoundPlayer().replaceDrop(data);
                    socket.emit("afterReplace", room.game.getCurrentRoundPlayer().getGameInformation(true));
                    socket.emit("playerRoundPeriod2", room.game.getCurrentPlayerSecondPeriodData());
                    socket.to(room.room_no).emit('playerReplace', {
                        index: room.game.playerRoundIndex,
                        hand: object.player.getGameInformation(false)
                    });
                }
            });

            // 杠
            socket.on('rod', function () {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    room.game.getCurrentRoundPlayer().rod();
                    socket.to(room.room_no).emit('playerRod', {
                        index: room.game.playerRoundIndex,
                        hand: room.game.getCurrentRoundPlayer().getGameInformation(false)
                    });
                    socket.emit("playerRoundPeriod2", room.game.getCurrentPlayerSecondPeriodData());
                    socket.emit('afterRod', room.game.getCurrentRoundPlayer().getGameInformation(true));
                }
            });

            // 暗杠
            socket.on('rodInHand', function (data) {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    if (typeof (data) == 'string') {
                        data = JSON.parse(data)
                    }
                    let flag = room.game.getCurrentRoundPlayer().rodInHand(data);
                    console.log(flag);
                    if (flag) {
                        socket.emit("afterPeriod2Operation", {
                            hand: object.player.getGameInformation(true),
                            operationsData: room.game.getCurrentPlayerSecondPeriodData()
                        });
                        socket.to(room.room_no).emit('playerRod', {
                            index: room.game.playerRoundIndex,
                            hand: room.game.getCurrentRoundPlayer().getGameInformation(false)
                        });
                        socket.emit('afterRod', room.game.getCurrentRoundPlayer().getGameInformation(true));
                    }
                }
            });

            // 取消玩家阶段1 进张
            socket.on('cancelOperation', function () {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    room.game.getCurrentRoundPlayer().draw();
                    socket.emit("playerRoundPeriod2", room.game.getCurrentPlayerSecondPeriodData());
                    socket.to(room.room_no).emit('playerDraw', {index: room.game.playerRoundIndex});
                }
            });

            // 补花
            socket.on('flower', function () {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    if (room.game.getCurrentRoundPlayer().information.id === object.player_original.id) {
                        room.game.getCurrentRoundPlayer().changeFlower();
                        socket.emit("afterPeriod2Operation", {
                            hand: object.player.getGameInformation(true),
                            operationsData: room.game.getCurrentPlayerSecondPeriodData()
                        });
                        socket.emit("afterFlower", {
                            index: room.game.playerRoundIndex,
                            hand: object.player.getGameInformation(true)
                        });
                        socket.to(room.room_no).emit('playerFlower', {
                            index: room.game.playerRoundIndex,
                            hand: object.player.getGameInformation(false)
                        });
                    }
                }
            });

            // 弃牌
            socket.on('drop', function (data) {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    data = parseInt(data);
                    object.player.is_first_round = false;
                    room.game.getCurrentRoundPlayer().drop(data);
                    socket.to(room.room_no).emit('playerDrop', {
                        index: room.game.playerRoundIndex,
                        hand: room.game.getCurrentRoundPlayer().getGameInformation(false)
                    });
                    let winArray = room.game.getCanWinArray();
                    if (winArray.indexOf(true) >= 0) {
                        socket.to(room.room_no).emit('gameRoundOver', room.game.getCanWinArray());
                        socket.emit('afterDrop', object.player.getGameInformation(true));
                    } else {
                        room.game.endPlayerRound();

                        socket.to(room.room_no).emit('playerRoundStart', room.game.playerRoundIndex);
                        socket.emit('playerRoundStart', room.game.playerRoundIndex);

                        socket.emit('afterDrop', object.player.getGameInformation(true));
                    }
                }
            });

            //  取消胡牌
            socket.on('cancelWin', function () {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    room.game.endPlayerRound();

                    socket.to(room.room_no).emit('playerRoundStart', room.game.playerRoundIndex);
                    socket.emit('playerRoundStart', room.game.playerRoundIndex);
                }

            });

            // 逃花
            socket.on('escape', function () {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    object.player.game_escape = true;
                    let report = room.game.getRoundReports();
                    socket.to(room.room_no).emit("playerEscape", report);
                    socket.emit("playerEscape", report);
                    room.game.previousEscapeIndex = object.player.getMyIndex();
                    clearTimeout(object.timer);
                    object.timer = null;
                    // endgame
                    let finish = room.game.endGame();
                    console.log(`finish:${finish}`);
                    if (finish) {
                        socket.to(object.roomNo).emit('finalReport', room.game.getFinalReports());
                        socket.emit('finalReport', room.game.getFinalReports());
                    } else {
                        socket.to(object.roomNo).emit('roomData', gameServer.rooms[object.roomNo].getRoomData());
                        socket.emit('roomData', gameServer.rooms[object.roomNo].getRoomData());
                    }
                }
            });

            // 胡
            socket.on('win', function () {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    if (object.player.canWin()) {
                        object.player.win_mahjong = room.game.drop_mahjong;
                        let report = room.game.getRoundReports();
                        socket.to(room.room_no).emit("playerWin", report);
                        socket.emit("playerWin", report);
                        room.game.previousWinIndex = object.player.getMyIndex();
                        // endgame
                        let finish = room.game.endGame();
                        console.log(`finish:${finish}`);
                        if (finish) {
                            socket.to(object.roomNo).emit('finalReport', room.game.getFinalReports());
                            socket.emit('finalReport', room.game.getFinalReports());
                        } else {
                            socket.to(object.roomNo).emit('roomData', gameServer.rooms[object.roomNo].getRoomData());
                            socket.emit('roomData', gameServer.rooms[object.roomNo].getRoomData());
                        }
                    }
                }
            });

            // 自摸
            socket.on('winSelf', function () {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    if (room.game.getCurrentRoundPlayer().canWin()) {
                        room.game.getCurrentRoundPlayer().win_mahjong = room.game.getCurrentRoundPlayer().hand_object.draw;
                        let report = room.game.getRoundReports();
                        socket.to(room.room_no).emit("playerWinSelf", report);
                        socket.emit("playerWinSelf", report);
                        room.game.previousWinIndex = room.game.playerRoundIndex;
                        // endgame
                        let finish = room.game.endGame();
                        console.log(`finish:${finish}`);
                        if (finish) {
                            socket.to(object.roomNo).emit('finalReport', room.game.getFinalReports());
                            socket.emit('finalReport', room.game.getFinalReports());
                        } else {
                            socket.to(object.roomNo).emit('roomData', gameServer.rooms[object.roomNo].getRoomData());
                            socket.emit('roomData', gameServer.rooms[object.roomNo].getRoomData());
                        }
                    }
                }
            });

            // 取消逃花
            socket.on('cancelEscape', function () {
                let room = gameServer.rooms[object.roomNo];
                if (room !== undefined) {
                    if (room.game.gameMasterIndex === object.player.getMyIndex()) {
                        object.player.is_first_round = false;
                    }
                }
            });

            // 请求游戏结束

        })

    }
}

exports.Server = Server;
