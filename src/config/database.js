const mongoose = require('mongoose');

module.exports = function (connectionString) {
    return mongoose.connect(connectionString);
}