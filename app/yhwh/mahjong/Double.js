let {Utils} = require('../utils/utils');
let {Treble} = require('./Treble');
let {Mahjong} = require('./Mahjong');

/**
 *
 */
class Double {

    /**
     * 构造函数
     * @param mahjongs
     */
    constructor(mahjongs) {

        this.pair = mahjongs;
        this.quotients = mahjongs[0].quotients;
    }

    /**
     * 获取升级后的碰牌对
     * @param mahjong
     * @returns {{touch: *, odd: *}|null}
     */
    getUpdatedTouch(mahjong) {
        if (mahjong.quotients !== this.quotients) {
            return null
        }
        if (mahjong.isWhite()) {
            return null
        }
        if (!this.hasWhite()) {
            return null
        } else {
            return {
                touch: Double.getDouble(this.pair[1], mahjong),
                odd: this.pair[0]
            }
        }
    }

    /**
     * 获取升级后的杠牌组
     * @param mahjong
     * @returns {null|Treble}
     */
    getUpdatedRod(mahjong) {
        if (mahjong.quotients !== this.quotients) {
            return null
        }
        if (mahjong.isWhite()) {
            return null
        }
        if (this.hasWhite()) {
            return null
        } else {
            return Treble.getTreble(this.pair[0], this.pair[1], mahjong)
        }
    }

    /**
     * 返回数值数组
     * @returns {*[]}
     */
    getMahjongNoArray() {
        return [this.pair[0].mahjong_no, this.pair[1].mahjong_no]
    }

    /**
     * 判断是否有白皮
     * @returns {boolean}
     */
    hasWhite() {
        return this.pair[0].remain < 3 || this.pair[1].remain < 3;
    }

    /**
     * 获取记分等级
     * @returns {number}
     */
    getScoreLevel() {
        if (this.pair[1].isWhite()) {
            return 0
        } else if (this.pair[1].isSingle()) {
            return this.pair[0].isSingle() ? 2 : 1
        } else if (this.pair[1].isDouble()) {
            return this.pair[0].isSingle() ? 4 : 3
        }
    }

    /**
     * 获取麻将编号
     * @returns {*[]}
     */
    getNumber() {
        return [this.pair[0].mahjong_no, this.pair[1].mahjong_no]
    }

    /**
     * 获取麻将符号
     * @returns {*[]}
     */
    getSign() {
        return [this.pair[0].sign, this.pair[1].sign]
    }

    /**
     * 判等
     * @param no
     * @returns {boolean}
     */
    equalTo(no) {
        if (no.length === 2) {
            let my_no = this.getNumber();
            return my_no[0] === no[0] && my_no[1] === no[1]
        } else {
            return false
        }
    }

    /**
     * 获取碰牌对，同时可检查是否成对
     * @param mahjong0
     * @param mahjong1
     * @returns {null|Double}
     */
    static getDouble(mahjong0, mahjong1) {

        if (typeof (mahjong0) == "number") {
            mahjong0 = new Mahjong(mahjong0)
        }

        if (typeof (mahjong1) == "number") {
            mahjong1 = new Mahjong(mahjong1)
        }

        if (mahjong0.isFlower() || mahjong1.isFlower()) {
            return null
        } else {
            let param = Utils.sortMahjongs([mahjong0, mahjong1]);
            if (Utils.checkTouch(param)) {
                return new Double(param);
            } else {
                return null
            }
        }
    }
}


exports.Double = Double;
