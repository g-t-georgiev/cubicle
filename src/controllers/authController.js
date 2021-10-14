const router = require('express').Router();

const authService = require('../services/authService');
const { TOKEN_NAME } = require('../config/constants');

const filterRequests = function (req, res, next) {
    const { user } = req;

    return !user ? next() : res.redirect('/');
}

const renderLoginPageHandler = (req, res) => res.render('auth/login');
const renderRegisterPageHandler = (req, res) => res.render('auth/register');

const loginHandler = function (req, res) {
    let { username, password } = req.body;

    username = username.trim().toLowerCase();
    password = password.trim();

    return authService.login(username, password)
        .then(user => authService.createToken(user))
        .then(token => {
            res.cookie(TOKEN_NAME, token, {
                httpOnly: true,
            });

            res.redirect('/');
        })
        .catch(err => {
            res.status(err.status ?? 400).send(err.message);
        });
};

const registerHandler = function (req, res) {
    let {username, password, repeatPassword} = req.body;

    username = username.trim().toLowerCase();
    password = password.trim();
    repeatPassword = repeatPassword.trim();

    if (!username || !password || !repeatPassword) {
        res.status(400).send('No empty inputs allowed.');
    }

    return authService.register(username, password, repeatPassword)
        .then(user => {
            console.log(user);
            res.redirect('/auth/login');
        })
        .catch(err => {
            res.status(err.status ?? 400).send(err.message);
        });
};

const logoutHandler = function (req, res) {
    const { user } = req;

    try {
        authService.logout(user);
        res.clearCookie(TOKEN_NAME);
    } catch (err) {
        console.log(err);
    } finally {
        res.redirect('/auth/login');
    }
};

router.get('/login', filterRequests, renderLoginPageHandler);
router.post('/login', filterRequests, loginHandler);
router.get('/register', filterRequests, renderRegisterPageHandler);
router.post('/register', filterRequests, registerHandler);
router.get('/logout', logoutHandler);

module.exports = router;