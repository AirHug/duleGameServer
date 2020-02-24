let db = require('../../utils/db');
let {Utils} = require('./utils/utils.js');
let {BaseRoom} = require("../common/Room");
let {Gamer} = require('./Gamer');

class Room extends BaseRoom{
    // 构造函数
    constructor(room_no, config) {
        if(config === null){
            config = Utils.getConfig()
        }
        super(room_no, config);
        let {Game} = require('./Game');
        this.game = new Game(this.config, this);
        this.timer = null;
        this.operateTime = 15000;
    }

    // 加入房间
    onPlayerJoin(original) {
        let index = this.findPlayerIndex(original.id);
        if (index >= 0) {
            this.players[index].is_online = true;
        } else {
            if (this.players.length !== 4) {
                index = this.players.length;
                this.players[index] = Gamer.make(this.game, original)
            }
        }
        if (index >= 0) {
            // db.updateRoom(this.id, this.players);
            return this.players[index];
        } else {
            return null
        }
    }

    // 创建房间
    createAndJoinRoom(original) {
        return db.createRoom(this.room_no, this.config.type, this.config).then((res) => {
            console.log(`room_no:${this.room_no},room_id:${res}`);
            this.id = res;
            return {
                player: this.onPlayerJoin(original),
                room_no: this.room_no
            };
        })
    }

    // 获得房间信息
    getRoomData() {
        let players = [];
        for (let key in this.players) {
            players[key] = this.players[key].getBaseInformation()
        }
        return {
            roomNo: this.room_no,
            isGaming: this.is_gaming,
            roundGaming: this.game.roundGaming,
            config: this.config,
            players: players
        }
    }

    // 获得游戏数据
    getGameData(id) {
        return this.is_gaming ? {
            // 摇张
            randomMahjong: this.game.randomMahjong,
            // 圈数
            topGameRoundNumber: this.game.topGameRoundNumber,
            // 小局数
            subGameRoundNumber: this.game.subGameRoundNumber,
            // 庄家座位
            gameMasterIndex: this.game.gameMasterIndex,
            // 玩家回合
            playerRoundIndex: this.game.playerRoundIndex,
            // 牌山余牌
            remain: this.game.mahjongBank.length,
            // 手牌信息
            players: this.game.getPlayerData(id)
        } : {}
    }

    // 尝试开始游戏
    tryStartGame(socket, callback) {
        let flag = false;
        if (this.players.length === 4) {
            flag = this.players[0].is_ready &&
                this.players[1].is_ready &&
                this.players[2].is_ready &&
                this.players[3].is_ready;
        }
        callback(flag, this);
    }

    startGame() {
        if (this.is_gaming) {
            this.game.startGame()
        } else {
            this.randomPlayers();
            this.game.initGame(this.players).startGame();
            this.is_gaming = true;
            db.gamingRoom(this.id).then((res) => {
                console.log('gamingRoom' + res)
            });
        }
    }
}

exports.Room = Room;
