module.exports = function (connectionString) {
    return require('mongoose').connect(connectionString);
}