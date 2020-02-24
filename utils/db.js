var mysql = require("mysql");
var config = require("./config");

var pool = null;

function query(sql, callback) {
    return pool.getConnection(function (err, conn) {
        if (err) {
            callback({error: err})
        } else {
            conn.query(sql, function (qerr, vals, fields) {
                // 释放连接
                conn.release();
                // 事件驱动回调
                callback({
                    error: qerr,
                    success: vals,
                    fields: fields
                })
            })
        }
    })
}

function init() {
    pool = mysql.createPool({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
        port: config.mysql.port,
    });
};
init();

exports.createRoom = function (room_no, game_type, rule) {
    var query_string = `insert into rooms set room_no = ${room_no}, game_type = '${game_type}', rule = '${JSON.stringify(rule)}', created_at='${(new Date()).toLocaleString()}' ;`;
    return new Promise((resolve, reject) => {
        query(query_string, (res) => {
            if (res.error !== null) {
                result = res.error.sqlMessage;
            } else {
                result = res.success.insertId
            }
            resolve(result)
        });
    });
};

exports.findPlayerRoom = function (player_id) {
    var query_string = `select * from rooms where (player_id0 = ${player_id} or player_id1 = ${player_id} or player_id2 = ${player_id} or player_id3 = ${player_id}) and status != 'CLOSED';`;
    return new Promise(((resolve, reject) => {
        query(query_string, (res) => {
            if (res.error !== null) {
                result = res.error.sqlMessage;
            } else {
                result = res.success
            }
            resolve(result)
        })
    }))
};

exports.updateRoom = function (id, players) {
    var query_string = `update rooms set player_id0 = ${players[0] === undefined ? 0 : players[0].information.id}, `
        + `player_id1 = ${players[1] === undefined ? 0 : players[1].information.id}, `
        + `player_id2 = ${players[2] === undefined ? 0 : players[2].information.id}, `
        + `player_id3 = ${players[3] === undefined ? 0 : players[3].information.id} where id = ${id}`;
    return new Promise(((resolve, reject) => {
        query(query_string, (res) => {
            if (res.error !== null) {
                result = res.error.sqlMessage;
            } else {
                result = res.success.affectedRows
            }
            resolve(result)
        });
    }))
};

exports.closeRoom = function (id) {
    var query_string = `update rooms set status = 'CLOSED' where id = ${id}`;
    return new Promise(((resolve, reject) => {
        query(query_string, (res) => {
            if (res.error !== null) {
                result = res.error.sqlMessage;
            } else {
                result = res.success.affectedRows
            }
            resolve(result)
        });
    }))
};

exports.gamingRoom = function (id) {
    var query_string = `update rooms set status = 'GAMING' where id = ${id}`;
    return new Promise(((resolve, reject) => {
        query(query_string, (res) => {
            if (res.error !== null) {
                result = res.error.sqlMessage;
            } else {
                result = res.success.affectedRows
            }
            resolve(result)
        });
    }))
};

exports.createHistory = function (game_type, game_rule, players) {
    var query_string = `insert into histories set game_type = '${game_type}', game_rule = ${game_rule}, player_id0 = ${players[0].id}, player_id1 = ${players[1].id}, player_id2 = ${players[2].id}, player_id3 = ${players[3].id};`

    return new Promise((resolve, reject) => {
        query(query_string, (res) => {
            if (res.error !== null) {
                result = res.error.sqlMessage;
            } else {
                result = res.success.insertId
            }
            resolve(result)
        });
    });
};

exports.saveHistoryLog = function (id, round_no, order, master, players, scores, operations) {

    var query_string = `insert into history_logs set round_no = ${round_no}, order = ${order}, master = ${master}, player_id1 = ${players[1].id}, player_id2 = ${players[2].id}, player_id3 = ${players[3].id}, `
        + `player_score0 = ${scores[0]}, player_score1 = ${scores[1]}, player_score2 = ${scores[2]}, player_score3 = ${scores[3]}, operations = '${operations}', history_id = '${id}`;

    return new Promise((resolve, reject) => {
        query(query_string, (res) => {
            if (res.error !== null) {
                result = res.error.sqlMessage
            } else {
                result = res.success.insertId
            }
            resolve(result)
        })
    })

};

exports.updateHistory = function (id, scores) {
    var query_string = `update histories set player_score0 = ${scores[0].id}, player_score1 = ${scores[1].id}, player_score2 = ${scores[2].id}, player_score3 = ${scores[3].id} where id = ${id}`;
    return new Promise(((resolve, reject) => {
        query(query_string, (res) => {
            if (res.error !== null) {
                result = res.error.sqlMessage;
            } else {
                result = res.success.affectedRows
            }
            resolve(result)
        });
    }));
};

exports.completePlayerInfo = function (id, token) {
    let query_string = `select * from players where id = ${id} and token = '${token}'`;
    return new Promise(((resolve, reject) => {
        query(query_string, (res) => {
            if (res.error !== null) {
                result = res.error.sqlMessage;
            } else {
                result = res.success
            }
            resolve(result)
        })
    }))
};

exports.init = init;
