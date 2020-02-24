var request = require("request");
var config = require("./config");

exports.get = function (url, headers = {}) {
    console.log(Object.assign({
        "content-type": "application/json",
    }, headers));
    return new Promise((resolve, reject) => {
        request({
            url: getFullUrl(url),
            method: "get",
            json: true,
            headers: Object.assign({
                "content-type": "application/json",
            }, headers),
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                resolve(body);
            }
        })
    })
};

exports.post = function (url, params, headers = {}) {
    console.log(123)
    return new Promise((resolve, reject) => {
        request({
            url: getFullUrl(url),
            method: "post",
            json: true,
            headers: Object.assign({
                "content-type": "application/json",
            }, headers),
            body: params
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                resolve(body);
            }
        })
    })
};


function getFullUrl(url) {
    return config.api.url + url;
}

