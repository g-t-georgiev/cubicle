const User = require('../models/User');

const jwt = require('../utils/jwt');

const register = function(username, password, repeatPassword) {
    if (!username || !password) {
        return Promise.reject({ errors: [new Error('Username or password must not be empty.')]});
    }
    
    return User.findOne({username})
        .then(user => {
            if (!user) {
                if (password !== repeatPassword) {
                    return Promise.reject({ errors: [new Error('Passwords do not match')] });
                }

                return User.create({ username, password });
            }

            return Promise.reject({ errors: [new Error('User already exist', 409)] });
        }); 
}

const login = function(username, password) {
    if (!username || !password) {
        return Promise.reject({ errors: [new Error('Username or password must not be empty.')]});
    }

    return User.findOne({ username })
        .then(user => {
            if (!user) {
                return Promise.reject({ errors: [new Error('Invalid username or password')] });
            }

            return user;
        })
        .then(user => Promise.all([user.validatePassword(password), user])
        .then(([isValid, user]) => isValid ? user : Promise.reject({ errors: [new Error('Invalid username or password')] })));
}

const logout = async function (user) {
    return Boolean(user);
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