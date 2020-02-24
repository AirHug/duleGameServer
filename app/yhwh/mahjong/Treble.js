let {Utils} = require('../utils/utils');
let {Mahjong} = require('./Mahjong');
class Treble {

    /**
     * 构造函数
     * @param mahjongs
     */
    constructor(mahjongs) {
        this.mahjongs = mahjongs;
        this.quotients = mahjongs[0].quotients;
    }

    /**
     * 获取麻将编号
     * @returns {*[]}
     */
    getNumber() {
        return [this.mahjongs[0].mahjong_no,
            this.mahjongs[1].mahjong_no,
            this.mahjongs[2].mahjong_no]
    }

    /**
     * 获取麻将符号
     * @returns {*[]}
     */
    getSign() {
        return [this.mahjongs[0].sign,
            this.mahjongs[1].sign,
            this.mahjongs[2].sign]
    }

    /**
     * 判等
     * @param no
     * @returns {boolean}
     */
    equalTo(no) {
        if (no.length === 3) {
            let my_no = this.getNumber();
            return my_no[0] === no[0] && my_no[1] === no[1] && my_no[2] === no[2]
        } else {
            return false
        }
    }

    /**
     * 获取杠牌对，同时可检查是否成杠
     * @param mahjong0
     * @param mahjong1
     * @param mahjong2
     * @returns {null|Treble}
     */
    static getTreble(mahjong0, mahjong1, mahjong2) {

        if(typeof(mahjong0) == "number"){
            mahjong0 = new Mahjong(mahjong0)
        }

        if(typeof(mahjong1) == "number"){
            mahjong1 = new Mahjong(mahjong1)
        }

        if(typeof(mahjong2) == "number"){
            mahjong2 = new Mahjong(mahjong2)
        }

        if (mahjong0.isFlower() || mahjong1.isFlower() || mahjong2.isFlower()) {
            return null
        } else {
            if (Utils.checkRod([mahjong0, mahjong1, mahjong2])){
                return new Treble(Utils.sortMahjongs([mahjong0, mahjong1, mahjong2]))
            } else {
                return null
            }
        }
    }
}

exports.Treble = Treble;
