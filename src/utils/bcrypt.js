const bcrypt = require('bcrypt');

const { SALT } = require('../config/constants');

const hashPassword = function (next) {
    return bcrypt.hash(this.password, SALT)
        .then(hash => {
            this.password = hash;
            next();
            return hash;
        });
}

const comparePassword = function (password) {
    // console.log(password, this.password);
    return bcrypt.compare(password, this.password);
}

module.exports = {
    hashPassword,
    comparePassword
}