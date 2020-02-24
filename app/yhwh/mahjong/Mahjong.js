let {Utils} = require('../utils/utils');

class Mahjong {
    /**
     * 构造函数
     * @param mahjong_no
     */
    constructor(mahjong_no) {
        this.mahjong_no = mahjong_no;
        this.sign = Utils.getMap()[mahjong_no];
        this.is_flower = true;
        this.remain = null;
        this.quotients = null;
        if (mahjong_no <= 125) {
            this.is_flower = false;
            this.remain = mahjong_no % 6;
            this.quotients = Math.floor(mahjong_no / 6);
        }
    }

    /**
     * 是否白皮
     * @returns {boolean}
     */
    isWhite() {
        return this.remain < 3;
    }

    /**
     * 是否单符号
     * @returns {boolean}
     */
    isSingle() {
        return this.remain === 3 || this.remain === 4;
    }

    /**
     * 是否双符号
     * @returns {boolean}
     */
    isDouble() {
        return this.remain === 5;
    }

    /**
     * 是否花牌
     * @returns {boolean}
     */
    isFlower() {
        return this.is_flower
    }

    /**
     * 获取麻将编号
     * @returns {*}
     */
    getNumber() {
        return this.mahjong_no;
    }

    /**
     * 获取麻将符号
     * @returns {*}
     */
    getSign() {
        return this.sign;
    }

    /**
     * 判等
     * @param no
     * @returns {boolean}
     */
    equalTo(no) {
        return this.getNumber() === no
    }
}

exports.Mahjong = Mahjong;
