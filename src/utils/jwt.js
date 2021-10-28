const jwt = require('jsonwebtoken');

const { SECRET } = require('../config/constants').AUTH;
const promisify = require('../helpers/promisify');

const sign = function (payload, options = null) {
    return promisify(jwt.sign).call(this, payload, SECRET, options);
}

const verify = function (token) {
    return promisify(jwt.verify).call(this, token, SECRET);
}

module.exports = {
    sign,
    verify
};