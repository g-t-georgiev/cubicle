const NODE_ENV = process.env.NODE_ENV ?? 'development';
const SERVER_PORT = process.env.PORT ?? 3000;
const DB_PORT = process.env.DB_PORT ?? 27017;

const SECRET = 'C3h6mBo7WVtocG6G078CA5ZHe0jvxvHLQ4L5Xvd93lg';
const TOKEN_NAME = 'App_Token';
const SALT = 10;

module.exports = {
    ENV: {
        NODE_ENV,
        SERVER_PORT,
        DB_PORT
    },
    AUTH: {
        SECRET,
    },
    SECRET,
    TOKEN_NAME,
    SALT
};