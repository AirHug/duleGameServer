/**
 * 默认游戏规则
 * @type {{doubleWhiteScore: boolean, roundNumber: number, doubleBonus: boolean, doubleEscapePunishment: boolean, fifteenBig: boolean, escapeTimeLimit: boolean}}
 */
const DEFAULT_CONFIG = {
    roundNumber: 3,
    doubleBonus: false,
    doubleEscapePunishment: false,
    doubleWhiteScore: false,
    fifteenBig: true,
    escapeTimeLimit: false
};

/**
 * 麻将
 * @type {*[]}
 */
const MAP = [
    "110", "110", "110", "111", "111", "112", // 11点牌6张 0~5
    "120", "120", "120", "121", "121", "122", // 12点牌6张 6~11
    "130", "130", "130", "131", "131", "132", // 13点牌6张 12~17
    "140", "140", "140", "141", "141", "142", // 14点牌6张 18~23
    "150", "150", "150", "151", "151", "152", // 15点牌6张 24~29
    "160", "160", "160", "161", "161", "162", // 16点牌6张 30~35
    "220", "220", "220", "221", "221", "222", // 22点牌6张 36~41
    "230", "230", "230", "231", "231", "232", // 23点牌6张 42~47
    "240", "240", "240", "241", "241", "242", // 24点牌6张 48~53
    "250", "250", "250", "251", "251", "252", // 25点牌6张 54~59
    "260", "260", "260", "261", "261", "262", // 26点牌6张 60~65
    "330", "330", "330", "331", "331", "332", // 33点牌6张 66~71
    "340", "340", "340", "341", "341", "342", // 34点牌6张 72~77
    "350", "350", "350", "351", "351", "352", // 35点牌6张 78~83
    "360", "360", "360", "361", "361", "362", // 36点牌6张 84~89
    "440", "440", "440", "441", "441", "442", // 44点牌6张 90~95
    "450", "450", "450", "451", "451", "452", // 45点牌6张 96~101
    "460", "460", "460", "461", "461", "462", // 46点牌6张 102~107
    "550", "550", "550", "551", "551", "552", // 55点牌6张 108~113
    "560", "560", "560", "561", "561", "562", // 56点牌6张 114~119
    "660", "660", "660", "661", "661", "662", // 66点牌6张 120~125
    "00", "00", "01", "02", "03", "04", "05", "06", "07", "08" // 花牌10张 126~135
];

/**
 * 大张
 * @type {*[]}
 */
const BIG_MAHJONG = [
    '11', '33', '44', '66', // 家位牌
    '12', '13', '16', '22', '25', '34', '46', '55', '56' // 9大牌
];

/**
 * 小张
 * @type {*[]}
 */
const SMALL_MAHJONG = [
    '24', '14', '23', '35', '36', '45'
];

/**
 * 258 常大摇摆张
 * @type {*[]}
 */
const EXTRA_MAHJONG = [
    '15', '26'
];

/**
 * 摇张组合
 * @type {{"11": [string, string, string], "22": [string, string, string], "33": [string, string, string], "44": [string, string, string], "55": [string, string, string], "66": [string, string, string], "12": [string, string, string], "23": [string, string, string], "34": [string, string, string], "45": [string, string, string], "56": [string, string, string], "13": [string, string, string], "24": [string, string, string], "35": [string, string, string], "46": [string, string, string], "14": [string, string, string], "25": [string, string, string], "36": [string, string, string], "15": [string, string, string], "26": [string, string, string], "16": [string, string, string]}}
 */
const RANDOM_MAHJONG = {
    '11': ['11', '66', '16'],
    '12': ['12', '34', '56'],
    '13': ['13', '25', '46'],
    '14': ['14', '25', '36'],
    '15': ['15', '26', '34'],
    '16': ['16', '25', '34'],
    '22': ['22', '55', '25'],
    '23': ['23', '45', '16'],
    '24': ['24', '35', '16'],
    '25': ['25', '34', '16'],
    '26': ['26', '15', '34'],
    '33': ['33', '44', '34'],
    '34': ['34', '25', '16'],
    '35': ['35', '24', '16'],
    '36': ['36', '14', '25'],
    '44': ['44', '33', '34'],
    '45': ['45', '23', '16'],
    '46': ['46', '13', '25'],
    '55': ['55', '22', '25'],
    '56': ['56', '12', '34'],
    '66': ['66', '11', '16']
};

class Utils {

    /**
     * 获取默认游戏配置
     * @returns {{doubleWhiteScore: boolean, roundNumber: number, doubleBonus: boolean, doubleEscapePunishment: boolean, fifteenBig: boolean, escapeTimeLimit: boolean}}
     */
    static getConfig() {
        return DEFAULT_CONFIG;
    }

    /**
     * 获取麻将图谱
     * @returns {*[]}
     */
    static getMap() {
        return MAP;
    }

    /**
     * 获取摇张数组
     * @returns {{"11": [string, string, string], "22": [string, string, string], "33": [string, string, string], "44": [string, string, string], "55": [string, string, string], "66": [string, string, string], "12": [string, string, string], "23": [string, string, string], "34": [string, string, string], "45": [string, string, string], "56": [string, string, string], "13": [string, string, string], "24": [string, string, string], "35": [string, string, string], "46": [string, string, string], "14": [string, string, string], "25": [string, string, string], "36": [string, string, string], "15": [string, string, string], "26": [string, string, string], "16": [string, string, string]}}
     */
    static getRandomMahjongArray() {
        return RANDOM_MAHJONG;
    }

    /**
     * 获取大牌数组
     * @param is_fifteen_big
     * @returns {*[]}
     */
    static getBigMahjongs(is_fifteen_big) {
        return is_fifteen_big ? BIG_MAHJONG.concat(EXTRA_MAHJONG) : BIG_MAHJONG;
    }

    /**
     * 获取小牌数组
     * @param is_fifteen_big
     * @returns {*[]}
     */
    static getSmallMahjongs(is_fifteen_big) {
        return is_fifteen_big ? SMALL_MAHJONG : SMALL_MAHJONG.concat(EXTRA_MAHJONG);
    }

    /**
     * 获取玩家下标
     * @param all
     * @param current
     * @returns {number}
     */
    static getPlayerIndex(all, current) {
        return current % all;
    }

    /**
     * 数组洗牌
     * @param array
     * @returns {[]}
     */
    static randomArrayElement(array) {
        let result = [];
        let count = array.length;
        for (let i = 0; i < count; ++i) {
            let index = Math.floor(Math.random() * (count - i));
            result[i] = array.splice(index, 1)[0]
        }
        return result;
    }

    /**
     * 数组转符号
     * @param no
     * @returns {*}
     */
    static numberToSign(no) {
        return MAP[no];
    }

    /**
     * 符号转数字
     * @param sign
     * @returns {number}
     */
    static signToNumber(sign) {
        return MAP.indexOf(sign);
    }

    /**
     * 符号数组转数字数组
     * @param array
     * @returns {[]}
     */
    static signArrayToNumberArray(array) {
        let result = [];
        for (let i in array) {
            let tmp = array[i];
            if (tmp.length === 2) {
                tmp = tmp + "0"
            }
            result.push(this.signToNumber(tmp))
        }
        return result;
    }

    /**
     * 数字数组转符号数组
     * @param array
     * @returns {[]}
     */
    static numberArrayToSignArray(array) {
        let result = [];
        for (let i in array) {
            let tmp = array[i];
            result.push(MAP[tmp])
        }
        return result;
    }

    /**
     * 数字转类型
     * @param mahjong_no
     * @returns {number}
     */
    static numberToType(mahjong_no) {
        return Math.floor(mahjong_no / 6);
    }

    /**
     * 数字数组转类型数组
     * @param array
     * @returns {[]}
     */
    static numberArrayToTypeArray(array) {
        let result = [];
        for (let i in array) {
            let tmp = array[i];
            result.push(Math.floor(tmp / 6))
        }
        return result;
    }

    /**
     * 检查杠组合是否合规
     * @param rod
     * @returns {boolean}
     */
    static checkRod(rod) {
        if (rod.length === 3) {
            // 商
            let quotients1 = rod[0].quotients;
            let quotients2 = rod[1].quotients;
            let quotients3 = rod[2].quotients;
            // 余数
            let remain1 = rod[0].remain;
            let remain2 = rod[1].remain;
            let remain3 = rod[2].remain;
            // 检查牌型
            if (quotients1 === quotients2 && quotients1 === quotients3) {
                // 检查牌
                return remain1 > 2 && remain2 > 2 && remain3 > 2;
            } else {
                return false
            }
        } else {
            return false
        }
    }

    /**
     * 检查碰牌是否合规
     * @param touch
     * @returns {boolean}
     */
    static checkTouch(touch) {
        if (touch.length === 2) {
            return touch[0].quotients === touch[1].quotients;
        } else {
            return false
        }
    }

    /**
     * 麻将排序
     * @param mahjongs
     * @returns {[Mahjong]}
     */
    static sortMahjongs(mahjongs) {
        return mahjongs.sort((a, b) => {
            return a.mahjong_no > b.mahjong_no
        });
    }

    /**
     * 排序函数
     * @param a
     * @param b
     * @returns {number}
     */
    static asc(a, b) {
        return a - b
    }

    /**
     * 麻将对象转数字数组
     * @param arr
     * @returns {[]}
     */
    static convertMahjongToNumberArray(arr) {
        let result = [];
        if (arr.length > 0) {
            for (let i in arr) {
                result[i] = arr[i].getNumber()
            }
        }
        return result;
    }
}

exports.Utils = Utils;
