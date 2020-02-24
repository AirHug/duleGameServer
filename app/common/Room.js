let db = require('../../utils/db');
/**
 * id: int 房间id
 * players: array 玩家列表
 * room_no: int 房间编号
 * config: json 房间配置
 * is_gaming: bool 房间是否游戏中
 * max_player_count: int 房间玩家最大人数
 */
class BaseRoom {
    /**
     * 构造函数
     * @param room_no
     * @param config
     */
    constructor(room_no, config){
        this.id = -1;
        this.room_no = room_no;
        this.players = [];
        this.config = config;
        this.is_gaming = false;
        this.max_player_count = 4;
    }

    /**
     * 离开房间
     * @param player
     * @returns {boolean}
     */
    onPlayerLeave(player) {
        let index = this.findPlayerIndex(player.id);
        if (index >= 0) {
            if (this.is_gaming) {
                this.players[index].is_online = false;
            } else {
                this.players.splice(index, 1);
                db.updateRoom(this.id, this.players);
            }
        }
        return true
    }

    /**
     * 关闭房间
     * @returns {boolean}
     */
    close() {
        db.closeRoom(this.id);
        return true;
    }

    /**
     * 返回指定玩家座位
     * @param player_id
     * @returns {number}
     */
    findPlayerIndex(player_id) {
        let index = -1;
        if (this.players.length === 0) {
            return -1;
        }
        for (let key in this.players) {
            if (this.players[key].data.id === player_id) {
                index = key;
                break;
            }
        }
        return index;
    }

    /**
     * 房间无玩家 或 房间玩家全不在线 关闭房间
     * @returns {boolean}
     */
    tryClose() {
        if (this.players.length === 0) {
            this.close();
            return true
        }
        for(let key in this.players) {
            if(this.players[key].is_online) {
                return false
            }
        }
        return true
    }

    /**
     * 打乱玩家座位
     */
    randomPlayers() {
        let result = [];
        while (this.players.length > 0) {
            let index = Math.floor(Math.random() * this.players.length);
            result.push(this.players.splice(index, 1)[0])
        }
        this.players = result;
    }

    /**
     * 设置房间游戏状态
     * @param flag
     */
    setGameStatus(flag){
        this.is_gaming = flag
    }

    /**
     * 获取房间允许最大玩家数量
     * @returns {number}
     */
    getMaxPlayerCount(){
        return this.max_player_count;
    }

    /**
     * 设置房间最大玩家数量
     * @param number
     */
    setMaxPlayerCount(number){
        this.max_player_count = number
    }
}

exports.BaseRoom = BaseRoom;
