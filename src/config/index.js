const { SERVER_PORT, DB_PORT } = require('./constants').ENV;

const env = {
    development: {
        port: SERVER_PORT ?? 3000,
        db: `mongodb://localhost:${DB_PORT}/cubicle`,
        url: `http://localhost:${SERVER_PORT}/`
    },
    production: {
        port: process.env.PORT,
        db: ''
    }
};

module.exports = env;