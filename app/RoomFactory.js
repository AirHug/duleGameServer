let db = require('../../utils/db');

class Room {
    // 构造函数
    constructor(room_no, config) {
        this.room_no = room_no;
        this.config = config;
        this.room = null;
    }

    getRoom() {
        if (this.room === null) {
            this.createRoom()
        }
        return this.room
    }

    /**
     *
     * { type: 'yhwh',
          roundNumber: '1',
          doubleBonus: false,
          doubleEscapePunishment: true,
          doubleWhiteScore: true,
          fifteenBig: true,
          escapeTimeLimit: true }
     */
    createRoom() {
        let Room = require(`./${this.config.type}/Room`).Room;
        this.room = new Room(this.room_no, this.config);
    }


}

exports.RoomFactory = RoomFactory;
