let {Utils} = require('./utils/utils.js');
let BaseGame = require("../common/Game").BaseGame;
let {Mahjong} = require('./mahjong/Mahjong');

/**
 * 类属性
 * config:{
 *     roundNumber: int 本桌游戏圈数
 *     thinkTime: int 玩家出牌时间
 *     doubleBonus: boolean 庄家是否翻倍
 *     doubleEscapePunishment: boolean 逃花惩罚翻倍
 *     doubleWhiteScore: boolean 白班积分翻倍（1000分）
 *     fifteenBig: boolean 268常大 大牌共15张
 *     escapeTimeLimit: boolean 五分钟无操作自动逃花
 * }
 * big_mahjong: array 大牌数组
 * small_mahjong: array 小牌数组
 * is_gaming: 是否正在游戏中
 * room: Room 房间对象
 * drop_mahjong: 弃牌
 * master_index: int 庄家下标
 * round_index: 玩家回合下标
 * top_round: 当前游戏圈数
 * sub_round: 本圈游戏小局数
 * escaper: 上一局逃花玩家
 * winner: 上一局胡牌玩家
 * is_over: 游戏是否结束
 * mahjong_array: 麻将牌
 * mahjong_bank: 当前麻将牌山
 * random_mahjongs: 摇张
 * circle_number: 游戏进行圈数
 *
 * logs:
 *
 *
 *
 */
class Game extends BaseGame{
    /**
     * 构造函数
     * @param config
     * @param room
     */
    constructor(config, room) {
        if (config === null) {
            config = Utils.getConfig()
        }
        super(config, room);
        this.big_mahjong = Utils.getBigMahjongs(this.config.fifteenBig);
        this.small_mahjong = Utils.getSmallMahjongs(this.config.fifteenBig);
        this.is_gaming = false;
    }

    /**
     * 初始化游戏
     * @returns {Game}
     */
    initGame() {

        // 弃牌清空
        this.drop_mahjong = null;
        // 庄家下标
        this.master_index = 0;
        // 玩家回合
        this.round_index = 0;
        // 游戏进行圈数
        this.circle_number = 0;
        // 当前圈游戏局编号
        this.top_round = 0;
        // 庄家连续次数
        this.sub_round = 1;
        // 上一局逃花玩家下标
        this.escaper = null;
        // 上一局胡牌玩家下标
        this.winner = null;
        // 游戏是否结束
        this.is_over = false;

        // 麻将牌
        this.mahjong_array = [];
        for (let i = 0; i < 136; ++i) {
            this.mahjong_array[i] = i;
        }
        return this;
    }

    /**
     * 开始游戏
     * @returns {Game}
     */
    startGame() {

        this.is_gaming = true;

        // 切换到庄家回合
        this.round_index = this.master_index;

        // 牌山洗牌
        this.mahjong_bank = Utils.randomArrayElement(this.mahjong_array.slice());

        // 摇张
        let randoms = [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ].sort();
        this.random_mahjongs = Utils.getRandomMahjongArray()[randoms.join('')];

        // 抽牌
        let hand_mahjongs = [[], [], [], []];
        for (let i = 0; i < 5; ++i) {
            hand_mahjongs[0] = hand_mahjongs[0].concat(this.mahjong_bank.splice(0, 4));
            hand_mahjongs[1] = hand_mahjongs[1].concat(this.mahjong_bank.splice(0, 4));
            hand_mahjongs[2] = hand_mahjongs[2].concat(this.mahjong_bank.splice(0, 4));
            hand_mahjongs[3] = hand_mahjongs[3].concat(this.mahjong_bank.splice(0, 4));
        }

        // 手牌整理
        for (let i = 0; i < 4; ++i) {
            this.room.players[Utils.getPlayerIndex(this.room.getMaxPlayerCount(), this.master_index + i)].setHand(hand_mahjongs[i]);
        }

        // 弃牌清空
        this.drop_mahjong = null;

        return this;
    }

    // 游戏结束
    endGame() {
        // 上把庄家逃
        console.log('circleNumber' + this.circleNumber)
        console.log('previousEscapeIndex' + this.previousEscapeIndex)
        console.log('gameMasterIndex' + this.gameMasterIndex)
        console.log(parseInt(this.previousEscapeIndex) === parseInt(this.gameMasterIndex))
        if (parseInt(this.previousEscapeIndex) === parseInt(this.gameMasterIndex)) {
            console.log('上把庄家逃');
            if (this.gameMasterIndex === 3) this.circleNumber++;
            this.gameMasterIndex = (this.gameMasterIndex + 1) % 4;
            this.topGameRoundNumber = (this.topGameRoundNumber + 1) % 4;
            this.subGameRoundNumber = 1;
        }
        // 上把边家胡牌
        if (parseInt(this.previousWinIndex) !== parseInt(this.gameMasterIndex)) {
            if (this.gameMasterIndex === 3) this.circleNumber++;
            this.gameMasterIndex = (this.gameMasterIndex + 1) % 4;
            this.topGameRoundNumber = (this.topGameRoundNumber + 1) % 4;
            this.subGameRoundNumber = 1;
        }
        // 超过游戏设置总圈数
        if (parseInt(this.circleNumber) === parseInt(this.config.roundNumber)) {
            this.isOver = true;
            return true
        }
        // 重置2个标记
        this.previousEscapeIndex = -1;
        this.previousWinIndex = -1;
        //
        this.roundGaming = false;
        // 清空玩家手牌
        for (let i in this.players) {
            this.players[i].resetPlayerInfo();
        }
        return false
    }

    /**
     * 结束玩家回合
     */
    endPlayerRound() {
        this.round_index = (this.round_index + 1) % 4;
    }

    // 当前玩家主阶段1可操作信息
    getCurrentPlayerFirstPeriodData() {
        let result = {
            rod: [],
            touch: [],
            replace: [],
            escape: false
        };
        if (this.drop_mahjong === null) {
            return result;
        } else {
            result.rod = this.getCurrentRoundPlayer().getRod();
            result.touch = this.getCurrentRoundPlayer().getAllTouch();
            result.replace = this.getCurrentRoundPlayer().getDropReplace();
            result.escape = this.getCurrentRoundPlayer().is_first_round;
            return result;
        }
    }

    // 当前玩家主阶段2可操作信息
    getCurrentPlayerSecondPeriodData() {
        let result = {
            canWin: false, // 自摸
            flower: false,// 补花
            rod: [],
            replace: [], // 暗杠
            hand: this.getCurrentRoundPlayer().getGameInformation(true)
        };
        result.canWin = this.getCurrentRoundPlayer().canWin();
        result.flower = this.getCurrentRoundPlayer().canChangeFlower();
        result.rod = this.getCurrentRoundPlayer().getAllRodInHand();
        result.replace = this.getCurrentRoundPlayer().getAllReplace();
        return result;
    }

    // 当前回合玩家
    getCurrentRoundPlayer() {
        return this.players[this.playerRoundIndex];
    }

    // 获取游戏玩家数据
    getPlayerData(player_id = 0) {
        let players = [];
        for (let key in this.players) {
            players[key] = this.players[key].getGameInformation(this.players[key].information.id === player_id)
        }
        return players;
    }

    // 从牌山获取新牌
    getNewMahjong() {
        return this.mahjong_bank.pop();
    }

    // 获取可以胡的玩家列表
    getCanWinArray() {
        let result = [];
        for (let i in this.players) {
            if (this.playerRoundIndex === i) {
                result[i] = null;
            } else {
                result[i] = this.players[i].canWin();
            }
        }
        result[this.playerRoundIndex] = false;
        return result;
    }

    /**
     * 获取上回合的玩家
     * @returns {*}
     */
    getPreviousPlayer() {
        let index = (this.round_index - 1 + 4) % 4;
        return this.room.players[index];
    }

    // 获取游戏结算报告
    getRoundReports() {
        let result = {
            scores: [],
            escapeIndex: -1,
            report: []
        };
        for (let i = 0; i < 4; ++i) {
            if (this.players[(this.gameMasterIndex + i) % 4].game_escape) {
                result.escapeIndex = i
            }
            result.report.push(this.players[(this.gameMasterIndex + i) % 4].computeScore())
        }
        for (let i in result.report) {
            let delt = 0;
            let my_score = result.report[i].total;
            for (let j in result.report) {
                if (j !== i) {
                    delt += my_score - result.report[j].total;
                }
            }
            result.report[i].delt = delt / 100;
            this.players[(this.gameMasterIndex + i) % 4].score += delt / 100;
            this.players[(this.gameMasterIndex + i) % 4].delt_logs.push(delt / 100);
        }
        for (let i = 0; i < 4; ++i) {
            result.scores.push(this.players[i].score)
        }
        return result;
    }

    // 获取最终结算报告
    getFinalReports() {
        let result = [];
        for (let i in this.players) {
            result.push({
                information: this.players[i].information,
                score: this.players[i].score,
                delt_logs: this.players[i].delt_logs
            })
        }
        return result;
    }

    // 转化数字型为表示型
    static translateMahjong(mahjong) {
        if (typeof mahjong === 'number') {
            return mahjongMap[mahjong];
        } else {
            let result = [];
            for (let i = 0; i < mahjong.length; i++) {
                result[i] = mahjongMap[mahjong[i]];
            }
            return result;
        }
    }

    // 转换玩家下标
    static getPlayerIndex(index) {
        return index % 4;
    }

    test() {
        let test_player = this.players[1];
        test_player.setHand([34, 51, 57, 81, 0, 3, 6, 9, 69, 70, 97, 101, 102, 107, 120, 124]);
        test_player.draw(21);
        test_player.touches.push([22, 23]);
        console.log(test_player.rodInHand([22, 23, 21]));
        console.log(test_player.rods);
        console.log(Utils.numberArrayToSignArray([36, 37]))
    }
}

exports.Game = Game;
