/**
 * game: Game 游戏对象
 * data: json 玩家信息
 */
class BasePlayer {
    constructor(game, player_data) {
        this.game = game;
        this.data = player_data;
    }
}

exports.BasePlayer = BasePlayer;
