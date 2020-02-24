/**
 * room: Room 游戏房间对象
 * config: json 游戏规则
 */
class BaseGame {
    constructor(config, room) {
        this.config = config;
        this.room = room;
    }
}

exports.BaseGame = BaseGame;
