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

    username = username.trim();
    password = password.trim();

    return authService.login(username.toLowerCase(), password)
        .then(user => authService.createToken(user))
        .then(token => {
            res.cookie(TOKEN_NAME, token, {
                httpOnly: true,
            });

            res.redirect('/');
        })
        .catch(error => {
            const { errors } = error;
            // console.log(errors);
            res.status(401).render('auth/login', { errors, username, password });
        });
};

const registerHandler = function (req, res) {
    let {username, password, repeatPassword} = req.body;

    username = username.trim();
    password = password.trim();
    repeatPassword = repeatPassword.trim();

    return authService.register(username.toLowerCase(), password, repeatPassword)
        .then(user => {
            // console.log(user);
            res.redirect('/auth/login');
        })
        .catch(error => {
            const { errors } = error;
            // console.log(errors);
            res.status(401).render('auth/register', { errors, username, password, repeatPassword });
        });
};

const logoutHandler = function (req, res) {
    const { user } = req;

    return authService.logout(user)
        .then(_ => {
            res.clearCookie(TOKEN_NAME);
        })
        .finally(() => {
            res.redirect('/auth/login');
        });
};

router.get('/login', filterRequests, renderLoginPageHandler);
router.post('/login', filterRequests, loginHandler);
router.get('/register', filterRequests, renderRegisterPageHandler);
router.post('/register', filterRequests, registerHandler);
router.get('/logout', logoutHandler);

module.exports = router;