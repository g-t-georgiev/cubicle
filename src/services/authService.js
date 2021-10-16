const User = require('../models/User');

const jwt = require('../utils/jwt');

const register = function(username, password, repeatPassword) {
    return User.findOne({username})
        .then(user => {
            if (!user) {
                if (password !== repeatPassword) {
                    return Promise.reject({ errors: [new Error('Passwords do not match')] });
                }

                return User.create({ username, password });
            }

            // return Promise.reject(new AuthError('User already exist', 409));
        }); 
}

const login = function(username, password) {
    return User.findOne({ username })
        .then(user => {
            if (!user) {
                return Promise.reject(new AuthError('Invalid username or password', 403));
            }

            return user;
        })
        .then(user => Promise.all([user.validatePassword(password), user])
        .then(([isValid, user]) => isValid ? user : Promise.reject(new AuthError('Invalid username or password', 403))));
}

const logout = function (user) {
    const isLoggedin = Boolean(user);

    if (!isLoggedin) {
        throw new AuthError('Invalid session token.', 403);
    }

    return isLoggedin;
}

const createToken = function (user) {
    const payload = {
        _id: user._id,
        username: user.username
    }

    return jwt.sign(payload);
}

module.exports = {
    register,
    login,
    logout,
    createToken
}