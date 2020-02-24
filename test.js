// let {Game} = require('./app/yhwh/Game');
// let {Player} = require('./app/yhwh/Player');
// let {Mahjong} = require('./app/yhwh/mahjong/Mahjong');
//
// let game = new Game();
//
// let player1 = new Player(game, {
//     "id": 10000,
//     "open_id": "open_id",
//     "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJV2PU4QW5xMSPxsTQQDcib97zD48WAFiabmhqFWq1Gicd3JbrCLt322maO4gibSks5mpgIqt6sLXhKLw/132",
//     "gold": 8888,
//     "nickname": "张哒哒1",
//     "mobile": "13173771011",
//     "created_at": "2019-06-22 12:22:58",
//     "updated_at": "2019-06-22 12:23:00",
//     "is_cheater": 0
// });
// let player2 = new Player(game, {
//     "id": 10001,
//     "open_id": "open_id",
//     "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJV2PU4QW5xMSPxsTQQDcib97zD48WAFiabmhqFWq1Gicd3JbrCLt322maO4gibSks5mpgIqt6sLXhKLw/132",
//     "gold": 8888,
//     "nickname": "张哒哒2",
//     "mobile": "13173771011",
//     "created_at": "2019-06-22 12:22:58",
//     "updated_at": "2019-06-22 12:23:00",
//     "is_cheater": 0
// });
// let player3 = new Player(game, {
//     "id": 10002,
//     "open_id": "open_id",
//     "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJV2PU4QW5xMSPxsTQQDcib97zD48WAFiabmhqFWq1Gicd3JbrCLt322maO4gibSks5mpgIqt6sLXhKLw/132",
//     "gold": 8888,
//     "nickname": "张哒哒3",
//     "mobile": "13173771011",
//     "created_at": "2019-06-22 12:22:58",
//     "updated_at": "2019-06-22 12:23:00",
//     "is_cheater": 0
// });
// let player4 = new Player(game, {
//     "id": 10003,
//     "open_id": "open_id",
//     "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJV2PU4QW5xMSPxsTQQDcib97zD48WAFiabmhqFWq1Gicd3JbrCLt322maO4gibSks5mpgIqt6sLXhKLw/132",
//     "gold": 8888,
//     "nickname": "张哒哒4",
//     "mobile": "13173771011",
//     "created_at": "2019-06-22 12:22:58",
//     "updated_at": "2019-06-22 12:23:00",
//     "is_cheater": 0
// });
// game.initGame([
//     player1,
//     player2,
//     player3,
//     player4
// ]);
// game.startGame();
// game.test();

// let db = require('./utils/db');
// let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQwZDNlNDIzNWZmYWUwMGYxZDliYmU3NWVlMDA1ZDE4YjE5ZjA4ZDIzMmVlYTg1NzUyYjcwZGIwMzc2ZGVkODBiMjFiZDI2NTY2MDhmMTQ4In0.eyJhdWQiOiIxIiwianRpIjoiZDBkM2U0MjM1ZmZhZTAwZjFkOWJiZTc1ZWUwMDVkMThiMTlmMDhkMjMyZWVhODU3NTJiNzBkYjAzNzZkZWQ4MGIyMWJkMjY1NjYwOGYxNDgiLCJpYXQiOjE1NjM2OTk3MTQsIm5iZiI6MTU2MzY5OTcxNCwiZXhwIjoxNTk1MzIyMTE0LCJzdWIiOiIxMDAwMSIsInNjb3BlcyI6W119.eGzTtiYwbHbtS53s82x3muNnFQxoGprHpo5X48r6kDOK2mRrykbkMWS5TmQY3NdsACu7PkN7tejgrtk9ekiIDFk6cBK1Ha5fxirtfpOtFeXwxi3vXSZJ0wCNTAA95Vd-Iceg-yU3RqiM1qJk-pelbciMAqplsH5Rzw4QnK9AMRQGS0Nq1HUH2Eh8YetKzH1ce4AgrZYM8uy38wEqMODG7E-TPl0Ox4ZC_LSqNJWgrrF3WQfTcmfgt3-ne6hvOQMpY5pt_R3UfqW1u_iuBX7fEO4eiFc-GKBxW2__cPur89rZZkv5nZ8y40IMVFy2Idw7jB2ft-BoG-rEEkQi8Kb8FqWMFUhvpn4MZvlMoomOELXXx8Fepm2AkxmA1odVAo5A9KEaWKCY9O4Qh5RE45j_Z9WOiVggPREcgRQp628vD2jV8DuN3hFJO9PbBr-wLCAysgMFhsKyYk5pmPRbsbT30Vrf1nyFIHnzFujk5gzsVKgeJ6ysq_CWe_ygeZbzgSZzWqjoNl5aZ3P6-3cjUeeHiTgYRoZM3IcxcIEm0SfGhRJw6YnOYMMz2e3bcXr5E0mScvfThXytllNnZXYUke_B-mZkmARLnyq7ZyUatrDjsX4UsVb8AcY3sho7d4n1B8wkyUa2VtNPk-Kn4oB6QU3ldr_XTLoa5yojesiJSPFShKU';
// db.completePlayerInfo(10001, token).then(res => {
//     console.log(res[0].is_cheater===1)
// });
// console.log(Mahjong.signToNumber("120"));


let Room = require('./app/yhwh/Room').Room;
let Mahjong = require('./app/yhwh/mahjong/Mahjong').Mahjong;

let room = new Room(10003, null);

let player1 = room.onPlayerJoin({
    "id": 10000,
    "open_id": "open_id",
    "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJV2PU4QW5xMSPxsTQQDcib97zD48WAFiabmhqFWq1Gicd3JbrCLt322maO4gibSks5mpgIqt6sLXhKLw/132",
    "gold": 8888,
    "nickname": "张哒哒1",
    "mobile": "13173771011",
    "created_at": "2019-06-22 12:22:58",
    "updated_at": "2019-06-22 12:23:00",
    "is_cheater": 1
});

let player2 = room.onPlayerJoin({
    "id": 10001,
    "open_id": "open_id",
    "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJV2PU4QW5xMSPxsTQQDcib97zD48WAFiabmhqFWq1Gicd3JbrCLt322maO4gibSks5mpgIqt6sLXhKLw/132",
    "gold": 8888,
    "nickname": "张哒哒1",
    "mobile": "13173771011",
    "created_at": "2019-06-22 12:22:58",
    "updated_at": "2019-06-22 12:23:00",
    "is_cheater": 0
});

let player3 = room.onPlayerJoin({
    "id": 10002,
    "open_id": "open_id",
    "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJV2PU4QW5xMSPxsTQQDcib97zD48WAFiabmhqFWq1Gicd3JbrCLt322maO4gibSks5mpgIqt6sLXhKLw/132",
    "gold": 8888,
    "nickname": "张哒哒1",
    "mobile": "13173771011",
    "created_at": "2019-06-22 12:22:58",
    "updated_at": "2019-06-22 12:23:00",
    "is_cheater": 0
});

let player4 = room.onPlayerJoin({
    "id": 10003,
    "open_id": "open_id",
    "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJV2PU4QW5xMSPxsTQQDcib97zD48WAFiabmhqFWq1Gicd3JbrCLt322maO4gibSks5mpgIqt6sLXhKLw/132",
    "gold": 8888,
    "nickname": "张哒哒1",
    "mobile": "13173771011",
    "created_at": "2019-06-22 12:22:58",
    "updated_at": "2019-06-22 12:23:00",
    "is_cheater": 0
});
room.game.initGame().startGame();
room.players[0].drop(room.players[0].hand_array[0]);
room.game.drop_mahjong = new Mahjong(81);
room.game.endPlayerRound();
console.log(room.game.round_index);
room.players[1].setHand([
    3, 4, 5, 26, 30, 37, 48, 55, 57, 69, 78, 80, 88, 96, 112, 115, 117, 127]);
console.log(room.players[1].hand_array);
console.log(room.players[1].getTouchDrop());
room.players[1].touchDrop();
console.log(room.players[1].hand_array);
console.log(room.players[1].touches[0].pair);
console.log("---------------------------");
room.game.drop_mahjong = new Mahjong(82);
console.log(room.players[1].getAllReplace());

// room.players[0].rodInHand([3, 4, 5]);
// console.log(room.players[0].hand_array);
// console.log(room.players[0].hand_object.treble);
// console.log(room.players[0].rods);
// room.players[0].changeFlower();
// room.players[1].draw()
// room.players[2].draw()
// room.players[3].draw()
// let Double = require('./app/yhwh/mahjong/Double').Double;
// let d = Double.getDouble(0,1);
// console.log(typeof d[0]);
