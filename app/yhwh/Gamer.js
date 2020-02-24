let {Double} = require('./mahjong/Double');
let {Treble} = require('./mahjong/Treble');
let {Mahjong} = require('./mahjong/Mahjong');
let {Utils} = require('./utils/utils.js');
let {BasePlayer} = require('../common/Player');

/**
 * score: 玩家分数
 * delt_logs: 分数日志
 *
 * hand_array: 手牌原始数组
 * hand_object: 手牌对象
 * touches: 碰
 * rods: 杠
 * extra: 花
 * drops: 弃牌
 * win_mahjong: 点炮牌
 * game_escape: 逃跑标记
 * is_first_round: 第一回合标记
 *
 * is_online: 在线标记
 * is_ready: 准备标记
 * token: 令牌
 */
class Gamer extends BasePlayer {
    /**
     * 构造函数
     * @param game
     * @param data
     */
    constructor(game, data) {
        super(game, data);
        this.score = 0;
        this.hand_array = [];
        this.resetHandObject();
        this.touches = [];
        this.rods = [];
        this.extra = [];
        this.drops = [];
        this.is_online = true;
        this.is_ready = false;
        this.token = '';
        this.win_mahjong = null;
        this.is_first_round = true;
        this.game_escape = false;
        this.delt_logs = [];
    }

    /**
     * 重置玩家对象
     */
    resetPlayerInfo() {
        this.hand_array = [];
        this.resetHandObject();
        this.touches = [];
        this.rods = [];
        this.extra = [];
        this.drops = [];
        this.win_mahjong = null;
        this.game_escape = false;
        this.is_first_round = true;
    }

    /**
     * 设置手牌
     * @param mahjongs
     * @returns {Gamer}
     */
    setHand(mahjongs) {
        this.hand_array = mahjongs;
        this.sortHand();
        return this;
    }

    /**
     * 获取手牌对象
     * @returns {{double: [], extra: [], draw: null, treble: [], odd: []}|*}
     */
    getHandObject() {
        return this.hand_object;
    }

    /**
     * 获取手牌数组
     * @returns {[]|Array}
     */
    getHandArray() {
        return this.hand_array;
    }

    /**
     * 重置手牌对象
     * @returns {Gamer}
     */
    resetHandObject() {
        this.hand_object = {
            odd: [],
            double: [],
            treble: [],
            extra: [],
            draw: null
        };
        return this;
    }

    /**
     * 增加手牌单张
     * @param mahjong
     */
    addHandOdd(mahjong) {
        if (typeof mahjong == "number") {
            this.hand_object.odd.push(new Mahjong(mahjong))
        } else {
            this.hand_object.odd.push(mahjong)
        }
    }

    /**
     * 增加手牌单张
     * @param mahjongs
     */
    addHandOdds(mahjongs) {
        for (let i in mahjongs) {
            this.addHandOdd(mahjongs[i])
        }
    }

    /**
     * 增加手牌对
     * @param mahjongs
     */
    addHandDouble(mahjongs) {
        this.hand_object.double.push(Double.getDouble(mahjongs[0], mahjongs[1]))
    }

    /**
     * 增加手牌杠
     * @param mahjongs
     */
    addHandTreble(mahjongs) {
        this.hand_object.treble.push(Treble.getTreble(mahjongs[0], mahjongs[1], mahjongs[2]))
    }

    /**
     * 增加手牌花牌
     * @param mahjongs
     */
    addHandExtra(mahjongs) {
        for (let i in mahjongs) {
            this.hand_object.extra.push(new Mahjong(mahjongs[i]));
        }
    }

    /**
     * 同步手牌数组到手牌对象
     */
    sortHand() {
        // 重置手牌对象内容
        this.resetHandObject();
        // 获取手牌外牌型
        let out_types = this.getOutSideMatchedType();
        // 手牌序列顺序排序
        this.hand_array.sort(Utils.asc);
        // 拷贝手牌序列
        let mahjongs = this.hand_array.slice();
        // 循环所有牌类型
        for (let i = 1; i < 22; ++i) {
            // 选出同花型牌 放入 tmp
            let tmp = [];
            while (mahjongs.length > 0) {
                if (mahjongs[0] < 6 * i && mahjongs[0] >= 6 * (i - 1)) {
                    tmp.push(mahjongs.splice(0, 1)[0])
                } else {
                    break;
                }
            }
            // 若该牌型已经存在于手牌外 全部加入到 odd 中
            if (out_types.indexOf(i - 1) !== -1 && tmp.length > 0) {
                this.addHandOdds(tmp);
                continue
            }

            // 根据牌型保存手牌
            if (tmp.length === 1) {
                // 单张
                this.addHandOdds(tmp);
            } else if (tmp.length === 2) {
                // 一对
                this.addHandDouble(tmp);
            } else if (tmp.length > 2) {
                // 三张以上
                // 收集框牌和非框牌
                let unnormal = [];
                let normal = [];
                for (let k = 0; k < tmp.length; ++k) {
                    let mj = new Mahjong(tmp[k]);
                    if (mj.isWhite()) {
                        normal.push(mj)
                    } else {
                        unnormal.push(mj)
                    }
                }

                // 根据框牌数量保存手牌
                switch (unnormal.length) {
                    case 0:
                        unnormal[1] = normal.pop();
                        unnormal[0] = normal.pop();
                        this.addHandDouble(unnormal);
                        if (normal.length > 0) {
                            this.addHandOdds(normal);
                        }
                        break;
                    case 1:
                        this.addHandDouble([
                            normal.pop(),
                            unnormal[0]
                        ]);
                        if (normal.length > 0) {
                            this.addHandOdds(normal);
                        }
                        break;
                    case 2:
                        this.addHandDouble(unnormal);
                        if (normal.length > 0) {
                            this.addHandOdds(normal);
                        }
                        break;
                    case 3:
                        this.addHandTreble(unnormal);
                        if (normal.length > 0) {
                            this.addHandOdds(normal);
                        }
                        break;
                }

            }
        }
        // 剩余为花牌，保存到手牌额外牌
        this.addHandExtra(mahjongs);
        this.sortOdd();
    }

    /**
     * 排序单牌
     */
    sortOdd() {
        let arr = this.hand_object.odd;
        let white = [];
        let single = [];
        let double = [];
        for (let i in arr) {
            if (arr[i].isWhite()) {
                white.push(arr[i]);
                continue;
            }
            if (arr[i].isSingle()) {
                single.push(arr[i]);
                continue;
            }
            if (arr[i].isDouble()) {
                double.push(arr[i]);
            }
        }
        this.hand_object.odd = white.concat(single).concat(double);
    }

    /**
     * 进张
     * @param mahjong
     * @returns {Gamer}
     */
    draw(mahjong = null) {
        console.log(`gamer draw`)
        let draw_mahjong = mahjong;
        if (draw_mahjong === null) {
            draw_mahjong = this.game.getNewMahjong();
            console.log(`true draw:${draw_mahjong}`)
        } else {
            console.log(`fake draw:${draw_mahjong}`)
        }
        this.hand_array.push(draw_mahjong);
        this.sortHand();
        this.hand_object.draw = draw_mahjong;
        return this;
    }

    /**
     * 弃牌
     * @param mahjong_no
     * @returns {Gamer}
     */
    drop(mahjong_no) {
        // 删除弃牌
        if (this.removeMahjongInHandArray(mahjong_no) > 0) {
            this.drops.push(new Mahjong(mahjong_no));
            this.game.drop_mahjong = new Mahjong(mahjong_no);
        }
        // 整理手牌
        this.sortHand();
        return this;
    }

    /**
     * 检查能否补花
     * @returns {boolean}
     */
    canChangeFlower() {
        // 进张是花
        if (this.hand_object.draw !== null && this.hand_object.draw.isFlower()) {
            return true
        } else {
            return this.hand_object.extra.length > 0
        }
    }

    /**
     * 补花
     */
    changeFlower() {
        // 整理手牌
        this.sortHand();
        // 取出花牌
        let tmp = this.hand_object.extra.slice();
        while (tmp.length > 0) {
            // 花牌移动到extra_cards
            let flower = tmp.pop();
            this.extra.push(flower);
            // 删除花牌
            this.removeMahjongInHandArray(flower.mahjong_no);
            this.sortHand();
            this.draw();
        }
    }

    /**
     * 获取所有可暗杠组合
     * @returns {[]}
     */
    getAllRodInHand() {
        let rods = [];
        // 获取手牌暗杠组合
        if (this.hand_object.treble.length > 0) {
            rods = this.hand_object.treble.slice()
        }

        // 对升级杠 暗杠
        // 已有的所有对子
        let pairs = this.getAllMyPair(true);
        // 已有可用单牌
        let odds = this.getAllMyOdd();
        // 配对检查
        for (let i in pairs) {
            for (let j in odds) {
                let treble = Treble.getTreble(pairs[i].pair[0], pairs[i].pair[1], odds[j]);
                if (treble !== null) {
                    rods.push(treble);
                    break;
                }
            }
        }
        return Utils.convertMahjongToNumberArray(rods);
    }

    /**
     * 暗杠
     * @param rod
     * @returns {boolean}
     */
    rodInHand(rod) {
        // 如果所给牌不能暗杠
        console.log('rod in hand');
        console.log(rod);
        let treble = Treble.getTreble(rod[0], rod[1], rod[2])
        if (treble === null) {
            return false
        }

        // 所给牌在手牌中的位置
        let index1 = this.hand_array.indexOf(rod[0]);
        let index2 = this.hand_array.indexOf(rod[1]);
        let index3 = this.hand_array.indexOf(rod[2]);

        // 手牌区杠
        if (index1 >= 0 && index2 >= 0 && index3 >= 0) {
            // 杠牌区加上杠牌组合
            this.rods.push(treble);
            // 手牌区删除这几张牌
            this.removeMahjongInHandArray(rod);
            // 整理手牌
            this.sortHand();
            // 进张
            this.draw();
            return true
        } else {
            // 吃牌区杠
            for (let i = 0; i < this.touches.length; ++i) {
                // 找到杠牌组
                let touch_type = this.touches[i].quotients;
                let rod_type = treble.quotients;
                if (touch_type === rod_type) {
                    this.removeMahjongInHandArray(rod);
                    // 吃牌区删
                    this.removeMahjongInTouches(this.touches[i].getNumber());
                    // 杠牌加
                    this.rods.push(treble);
                    // 整理手牌
                    this.sortHand();
                    // 进张
                    this.draw();
                    return true
                }
            }
            return false
        }
    }

    /**
     * 检查是否可以点杠
     * @returns {Array|*[]}
     */
    getRodDrop() {
        // 弃牌为无框牌不能点杠
        if (this.game.drop_mahjong === null || this.game.drop_mahjong.isWhite()) {
            return [];
        }

        // 已有的所有对子
        let pairs = this.getAllMyPair(true);

        // 配对检查
        for (let i in pairs) {
            let pair = pairs[i];
            let updatedTreble = pair.getUpdatedRod(this.game.drop_mahjong);
            if (updatedTreble !== null) {
                return updatedTreble.getNumber();
            }
        }
        return [];
    }

    /**
     * 点杠
     * @returns {boolean}
     */
    rodDrop() {
        // 弃牌为无框牌不能点杠
        if (this.game.drop_mahjong === null || this.game.drop_mahjong.isWhite()) {
            return false;
        }

        // 检查手牌
        for (let i = 0; i < this.hand_object.double.length; ++i) {
            let treble = this.hand_object.double[i].getUpdatedRod(this.game.drop_mahjong);
            if (treble !== null) {
                // 杠牌区添加对应牌
                this.rods.push(treble);
                // 手牌区删除对应牌
                this.removeMahjongInTouches(treble.getNumber());
                // 整理手牌
                this.sortHand();
                // 进张
                this.draw();
                // 移除上一个玩家的弃牌
                this.game.getPreviousPlayer().removeLatestDrop();

                this.game.drop_mahjong = null;
                return true
            }
        }

        // 检查吃牌区
        for (let i = 0; i < this.touches.length; ++i) {
            let treble = this.touches[i].getUpdatedRod(this.game.drop_mahjong);
            if (treble !== null) {
                // 杠牌区添加对应牌
                this.rods.push(treble);
                // 吃牌区删除对应牌
                this.removeMahjongInTouches(this.touches[i].getNumber());
                // 整理手牌
                this.sortHand();
                // 进张
                this.draw();
                // 移除上一个玩家的弃牌
                this.game.getPreviousPlayer().removeLatestDrop();

                this.game.drop_mahjong = null;
                return true
            }
        }

        return false

    }

    /**
     * 获取所有吃对
     * 手牌和上家弃牌组成对
     * @returns {Array|*[]}
     */
    getTouchDrop() {
        if (this.game.drop_mahjong === null) {
            return [];
        }
        let drop_mahjong = this.game.drop_mahjong;
        let pairs = this.getAllMyPair(false);
        let doubleMatched = false;

        for (let i in pairs) {
            let pair = pairs[i];
            if (pair.quotients === drop_mahjong.quotients) {
                doubleMatched = true;
                let updatedResult = pair.getUpdatedTouch(this.game.drop_mahjong);
                if (updatedResult !== null) {
                    return updatedResult.touch.getNumber();
                }
            }
        }

        if (!doubleMatched) {
            let odds = this.getAllMyOdd();
            for (let i in odds) {
                let odd = odds[i];
                let double = Double.getDouble(odd, drop_mahjong);
                if (double !== null) {
                    return double.getNumber()
                }
            }
        }

        return [];
    }

    /**
     * 吃牌
     * 手牌和上家弃牌组成对
     * @returns {boolean}
     */
    touchDrop() {
        if (this.game.drop_mahjong === null) {
            return false;
        }
        let drop_mahjong = this.game.drop_mahjong;
        let pairs = this.getAllMyPair(false);
        let doubleMatched = false;

        // 检查对
        for (let i in pairs) {
            let pair = pairs[i];
            if (pair.quotients === drop_mahjong.quotients) {
                doubleMatched = true;
                let updatedResult = pair.getUpdatedTouch(this.game.drop_mahjong);
                if (updatedResult !== null) {

                    this.touches.push(updatedResult.touch);
                    this.removeMahjongInHandArray(updatedResult.touch.getNumber());
                    // 删除上一个玩家的弃牌
                    this.game.getPreviousPlayer().removeLatestDrop();

                    this.game.drop_mahjong = null;
                    return true;
                }
            }
        }

        // 检查单
        if (!doubleMatched) {

            let odds = this.getAllMyOdd();
            for (let i in odds) {
                let odd = odds[i];
                let double = Double.getDouble(odd, drop_mahjong);
                if (double !== null) {
                    this.touches.push(double);
                    // 删除玩家的手牌
                    this.removeMahjongInHandArray(double.getNumber());
                    // 删除上一个玩家的弃牌
                    this.game.getPreviousPlayer().removeLatestDrop();

                    this.game.drop_mahjong = null;
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 检查是否可以替换
     * 1、上家弃牌和手牌外对子可替换
     * 2、手牌单张和手牌外对子可替换
     * @returns {[]}
     */
    getAllReplace() {
        let pairs = this.touches.slice();
        let odds = this.getAllMyOdd();
        if (this.game.drop_mahjong !== null) {
            odds.unshift(this.game.drop_mahjong);
        }
        for (let i in pairs) {
            let pair = pairs[i];
            console.log(odds);
            for (let j in odds) {
                let odd = odds[j];
                let updatedTouch = pair.getUpdatedTouch(odd);
                if (updatedTouch !== null) {
                    return updatedTouch.touch.getNumber();
                }
            }
        }
        return [];
    }

    /**
     * 替换牌
     * 1、上家弃牌和手牌外对子可替换
     * 2、手牌单张和手牌外对子可替换
     * @param touch
     * @returns {boolean}
     */
    replace(touch) {
        let newPair = Double.getDouble(touch[0], touch[1]);
        let pairs = this.touches;
        for (let i in pairs) {
            let oldPair = pairs[i];
            if (newPair.quotients === oldPair.quotients) {
                let white = oldPair.getWhite();
                // 删牌
                let index = this.hand_array.indexOf(newPair.pair[0].mahjong_no);
                if (index >= 0) {
                    this.hand_array.splice(index, 1);
                }
                index = this.hand_array.indexOf(newPair.pair[1].mahjong_no);
                if (index >= 0) {
                    this.hand_array.splice(index, 1);
                }
                // 替换touch
                this.touches[i] = newPair.getMahjongNoArray();
                // 假draw
                this.draw(white.mahjong_no);
                return true;
            }
        }
        return false;
    }

    // 弃牌替牌组合
    getDropReplace() {
        if (this.game.drop_mahjong === null) {
            return [];
        }
        let drop = new Mahjong(this.game.drop_mahjong);
        if (drop.is_flower) {
            return [];
        }
        if (drop.isWhite()) {
            return [];
        }
        let pairs = this.touches;
        for (let i in pairs) {
            let pair = Double.getDouble(new Mahjong(pairs[i][0]), new Mahjong(pairs[i][1]))
            if (pair.quotients === drop.quotients) {
                if (pair.hasWhite()) {
                    return [
                        pair.pair[1].mahjong_no,
                        drop.mahjong_no
                    ]
                }
            }
        }
        return [];
    }

    // 弃牌替牌
    replaceDrop() {
        if (this.game.drop_mahjong === null) {
            return;
        }
        let drop = new Mahjong(this.game.drop_mahjong);
        if (drop.is_flower) {
            return;
        }
        if (drop.isWhite()) {
            return;
        }
        let pairs = this.touches;
        for (let i in pairs) {
            let pair = Double.getDouble(new Mahjong(pairs[i][0]), new Mahjong(pairs[i][1]))
            if (pair.quotients === drop.quotients) {
                if (pair.hasWhite()) {
                    // 替换touch
                    this.touches[i] = [
                        pair.pair[1].mahjong_no,
                        drop.mahjong_no
                    ];
                    // 假draw
                    this.draw(pair.pair[0].mahjong_no);
                    // 删除上一个玩家的弃牌
                    let previousPlayer = this.game.getPreviousPlayer();
                    let dropDeleteIndex = previousPlayer.drops.indexOf(this.game.drop_mahjong)
                    if (dropDeleteIndex >= 0) {
                        previousPlayer.drops.splice(dropDeleteIndex, 1)
                    }
                    // 清空弃牌
                    this.game.drop_mahjong = null
                }
            }
        }
    }

    // 能否胡牌 1
    canWin() {
        if (this.hand_object.odd.length === 2) {
            let matched = this.getMatchedType();
            // odd 中含有已配对牌型的牌
            if (matched.indexOf((new Mahjong(this.hand_object.odd[0])).quotients) >= 0 || matched.indexOf((new Mahjong(this.hand_object.odd[1])).quotients) >= 0) {
                return false;
            }

            let odd0 = new Mahjong(this.hand_object.odd[0]);
            let odd1 = new Mahjong(this.hand_object.odd[1]);
            let extra = null;
            // 自摸胡
            if (this.hand_object.draw !== null) {
                extra = this.hand_object.draw;
                // 点炮胡
            } else {
                extra = this.game.drop_mahjong;
            }

            if (odd0.isWhite() && odd1.isWhite()) {
                return false;
            }
            if (!odd0.isWhite() && !odd1.isWhite()) {
                return !!(Gamer.checkTouch([this.hand_object.odd[0], extra]) || Gamer.checkTouch([this.hand_object.odd[1], extra]));
            }
            if (odd0.isWhite()) {
                return Gamer.checkTouch([odd0.mahjong_no, extra]);
            } else {
                return Gamer.checkTouch([odd1.mahjong_no, extra]);
            }
        }
        if (this.hand_object.odd.length === 0) {
            let extra = null;
            // 自摸胡
            if (this.hand_object.draw !== null) {
                extra = new Mahjong(this.hand_object.draw);
                // 点炮胡
            } else {
                extra = new Mahjong(this.game.drop_mahjong);
            }
            let matched = this.getMatchedType();
            // odd 中含有已配对牌型的牌
            if (matched.indexOf(extra.quotients) >= 0) {
                return false;
            }
            return !extra.isWhite();
        }
        return false;
    }

    // 丢弃进张
    dropDraw() {
        this.draw(this.hand_object.draw);
    }

    // 超时操作
    doTimeOutOperation() {
        if (this.hand_array.length % 2 === 0) {
            this.draw();
            return 1;
        } else {
            this.dropDraw();
            return 2;
        }
    }

    // 获取手牌外已配对牌型
    getOutSideMatchedType() {
        let result = [];
        // 收集吃牌区牌类型
        if (this.touches.length > 0) {
            for (let i = 0; i < this.touches.length; ++i) {
                result.push(Math.floor(this.touches[i][0] / 6));
            }
        }
        // 收集杠牌区牌类型
        if (this.rods.length > 0) {
            for (let i = 0; i < this.rods.length; ++i) {
                result.push(Math.floor(this.rods[i][0] / 6));
            }
        }
        return result;
    }

    // 获取手牌内以配对牌型
    getInsideMatchedType() {
        let result = [];
        // 收集 double 牌牌型
        if (this.hand_object.double.length > 0) {
            for (let i = 0; i < this.hand_object.double.length; ++i) {
                result.push(Math.floor(this.hand_object.double[i][0] / 6));
            }
        }
        // 收集 treble 牌牌型
        if (this.hand_object.treble.length > 0) {
            for (let i = 0; i < this.hand_object.treble.length; ++i) {
                result.push(Math.floor(this.hand_object.treble[i][0] / 6));
            }
        }
        return result;
    }

    // 获取已配对牌型
    getMatchedType() {
        return this.getInsideMatchedType().concat(this.getOutSideMatchedType());
    }

    // 获取玩家基本信息
    getBaseInformation() {
        return {
            information: this.information,
            is_online: this.is_online,
            is_ready: this.is_ready
        }
    }

    // 获取玩家游戏信息
    getGameInformation(show_detail = false) {
        return {
            information: this.information,
            is_online: this.is_online,
            score: this.score,
            hand: {
                count: this.getHandCount(),
                out: {
                    touches: this.touches,
                    rods: this.rods,
                    extra: this.extra,
                    drops: this.drops
                },
                inner: show_detail ? this.hand_object : null
            }
        }
    }

    // 获取手牌数
    getHandCount() {
        return this.hand_array.length;
    }

    // 计算分数
    computeScore() {
        let result = {
            avatar: this.information.avatar,
            pairs: [],
            is_win: this.win_mahjong !== null,
            is_escape: false,
            extras: [],
            total: 0,
            delt: 0
        };
        if (this.game_escape) {
            result.is_escape = true;
            return result;
        }

        let typeArray = [20, 0, 15, 11];
        let myPositionType = typeArray[this.getMyPositionType()];
        let bigMahjong = this.game.bigMahjong;
        let randomMahjong = this.game.randomMahjong;
        let doubleWhiteScore = this.game.config.doubleWhiteScore;
        let total = 0;

        let pairs = this.hand_object.double.slice().concat(this.touches);
        for (let i in pairs) {
            let pair = pairs[i];
            result.pairs.push(this.computePairScore(pair, randomMahjong, myPositionType, bigMahjong))
        }
        let trebles = this.hand_object.treble.slice().concat(this.rods);
        for (let i in trebles) {
            let treble = trebles[i];
            result.pairs.push(this.computeTrebleScore(treble, randomMahjong, myPositionType, bigMahjong))
        }
        let extras = this.hand_object.extra.slice().concat(this.extra);
        result.extras = extras;
        for (let i in extras) {
            let extra = extras[i];
            if (Mahjong.numberToSign(extra) === "00") {
                total += 500 * (doubleWhiteScore ? 2 : 1)
            } else {
                total += 500
            }
        }

        if (result.is_win) {
            let temp = this.computeWinScore(this.hand_object.odd, this.win_mahjong, randomMahjong, myPositionType, bigMahjong);
            result.pairs.push(temp[0]);
            if (this.hand_object.odd.length !== 0) {
                result.pairs.push(temp[1]);
            }
        }

        for (let i in result.pairs) {
            result.total += result.pairs[i].score
        }

        result.total = result.total + total;

        return result;
    }

    // 计算对子分数
    computePairScore(pair, random, position_type, big) {
        let bigScoreArray = [100, 200, 400, 400, 800];
        let smallScoreArray = [100, 100, 100, 100, 200];

        let double = Double.getDouble(new Mahjong(pair[0]), new Mahjong(pair[1]));
        let score = 0;
        let times = 1;
        let targetScoreArray = smallScoreArray;

        let double_type = Utils.numberToSign(pair[0]).substring(0, 2);

        // 设置基本分数组
        if (big.indexOf(double_type) >= 0) {
            targetScoreArray = bigScoreArray;
        }

        // 摇张翻倍
        if (random.indexOf(double_type) >= 0) {
            targetScoreArray = bigScoreArray;
            times = 2;
        }

        // 设置基本分
        score = targetScoreArray[double.getScoreLevel()] * times;
        if (position_type === double.quotients) {
            score = score * 2
        }

        // 268 常大翻倍
        if (this.game.config.fifteenBig) {
            if (double_type === '26' || double_type === '15') {
                score = score * 2
            }
        }

        return {
            unit: pair,
            score: score
        };
    }

    // 计算杠牌分数
    computeTrebleScore(treble, random, position_type, big) {

        console.log(treble);

        let trebleType = Utils.numberToSign(treble[0]).substring(0, 2);
        let score = 0;
        let times = 1;

        // 设置基本分数组
        if (big.indexOf(trebleType) >= 0) {
            score = 1600;
        } else {
            score = 400;
        }
        if (random.indexOf(trebleType) >= 0) {
            score = 1600;
            times = 2;
        }
        score = score * times;
        if (position_type === treble.quotients) {
            score = score * 2
        }

        // 268 常大翻倍
        if (this.game.config.fifteenBig) {
            if (trebleType === '26' || trebleType === '15') {
                score = score * 2
            }
        }

        return {
            unit: treble,
            score: score
        };
    }

    // 计算和牌者的分数
    computeWinScore(odds, win, random, position_type, big) {
        let result = [];
        let double = null;
        let odd = null;
        if (odds.length === 2) {
            let mahjong0 = new Mahjong(odds[0]);
            let mahjong1 = new Mahjong(odds[1]);
            let mahjong2 = new Mahjong(win);
            if (Gamer.checkTouch([mahjong2.mahjong_no, mahjong0.mahjong_no])) {
                double = Double.getDouble(mahjong0, mahjong2);
                odd = mahjong1;
            } else {
                double = Double.getDouble(mahjong1, mahjong2);
                odd = mahjong0;
            }
            result.push(this.computePairScore(double.getMahjongNoArray(), random, position_type, big));
        } else {
            odd = new Mahjong(win);
        }


        let odd_type = Utils.numberToSign(odd.mahjong_no).substring(0, 2);
        let smallScore = [200, 400];
        let bigScore = [800, 1600];
        let score = 0;
        let times = 1;
        let targetScore = null;
        if (big.indexOf(odd_type) >= 0) {
            targetScore = bigScore;
        } else {
            targetScore = smallScore;
        }
        if (random.indexOf(odd_type) >= 0) {
            times = 2
        }

        if (odd.isSingle()) {
            score = targetScore[0]
        } else if (odd.isDouble()) {
            score = targetScore[1]
        }

        score = score * times;

        if (position_type === odd.quotients) {
            score = score * 2
        }

        // 268 常大翻倍
        if (this.game.config.fifteenBig) {
            if (odd_type === '26' || odd_type === '15') {
                score = score * 2
            }
        }

        result.push({
            unit: [odd.mahjong_no],
            score: score
        });

        return result;
    }

    // 获取我的位置牌
    getMyPositionType() {
        let myIndex = this.getMyIndex();
        let tmp = myIndex - this.game.gameMasterIndex;
        return tmp < 0 ? (tmp + 4) : tmp
    }

    // 获取我的位置
    getMyIndex() {
        for (let i in this.game.players) {
            if (this.game.players[i].data.id === this.data.id) {
                return i;
            }
        }
    }

    /**
     * 删除最近的一张弃牌
     */
    removeLatestDrop() {
        let index = this.drops.length - 1;
        if (index >= 0) {
            this.drops.splice(index, 1);
        }
    }

    /**
     * 根据麻将对编号移除麻将碰对
     * @param no
     * @returns {string|number}
     */
    removeMahjongInTouches(no) {
        for (let i in this.touches) {
            if (this.touches[i].equalTo(no)) {
                this.touches.splice(i, 1);
                return i;
            }
        }
        return -1;
    }

    /**
     * 根据编号删除手牌数组
     * @param no
     * @returns {number}
     */
    removeMahjongInHandArray(no) {
        let deleteCount = 0;
        if (typeof no === 'number') {
            no = [no]
        }
        for (let i in no) {
            let deleteIndex = this.hand_array.indexOf(no[i]);
            if (deleteIndex >= 0) {
                this.hand_array.splice(deleteIndex, 1);
                deleteCount++;
            }
        }
        return deleteCount;
    }

    /**
     * 获取所有对
     * @returns {*[]}
     */
    getAllMyPair(all = true) {
        let result = this.hand_object.double.slice();
        if (all) {
            if (this.touches.length > 0) {
                result.concat(this.touches);
            }
        }
        return result;
    }

    /**
     * 获取所有单牌
     * @returns {*[]}
     */
    getAllMyOdd() {
        let result = this.hand_object.odd.slice();
        if (this.hand_object.draw !== null && !this.hand_object.draw.isFlower()) {
            result = result.concat(this.hand_object.draw);
        }
        return result;
    }

    /**
     * 创建玩家对象
     * @param game
     * @param data
     * @returns {Gamer|Cheater}
     */
    static make(game, data) {
        if (data.is_cheater) {
            return new Cheater(game, data)
        } else {
            return new Gamer(game, data)
        }
    }
}

class Cheater extends Gamer {
    /**
     * 构造函数
     * @param game
     * @param data
     */
    constructor(game, data) {
        super(game, data);
    }

    // 进张 1
    draw(mahjong = null) {
        console.log(`cheater draw`)
        let draw_mahjong = mahjong;
        if (draw_mahjong === null) {
            draw_mahjong = this.game.getNewMahjong();
            console.log(`true draw:${draw_mahjong}`)
        } else {
            console.log(`fake draw:${draw_mahjong}`)
        }
        this.sortHand();
        this.hand_array.push(draw_mahjong);
        this.hand_object.draw = new Mahjong(draw_mahjong);
        return this;
    }

}

exports.Gamer = Gamer;
exports.Cheater = Cheater;
