const jwt = require('jsonwebtoken');

const constants = require('../config/constants');
const promisify = require('../helpers/promisify');

const sign = function (payload, options = null) {
    return promisify(jwt.sign).call(this, payload, constants.SECRET, options);
}

const verify = function (token) {
    return promisify(jwt.verify).call(this, token, constants.SECRET);
}

module.exports = {
    sign,
    verify
};