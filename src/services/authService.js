const User = require('../models/User');

const jwt = require('../utils/jwt');

let error;

const register = async function(username, password, repeatPassword) {
    if (!username || !password) {
        error = new Error('Username or password must not be empty.');
        error.statusCode = 403;
        throw error;
    }
    
    const user = await User.findOne({username})

    if (user) {
        error = new Error('User already exist', 409);
        error.statusCode = 409;
        throw error;
    }

    if (password !== repeatPassword) {
        error = new Error('Passwords do not match');
        error.statusCode = 403;
        throw error;
    }

    return User.create({ username, password });
}

const login = async function(username, password) {
    if (!username || !password) {
        error = new Error('Username or password must not be empty.');
        error.statusCode = 403;
        throw error;
    }

    const user = await User.findOne({ username });

    if (!user) {
        error = new Error('Invalid username or password');
        error.statusCode = 401;
        throw error;
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
        error = new Error('Invalid username or password');
        error.statusCode = 401;
        throw error;
    }

    return user;
}

const createToken = function (user) {
    const payload = {
        id: user._id,
        username: user.username
    }

    return jwt.sign(payload);
}

module.exports = {
    register,
    login,
    createToken
}