const router = require('express').Router();

const authService = require('../services/authService');
const { TOKEN_NAME } = require('../config/constants');

const filterRequests = function (req, res, next) {
    const { user } = req;

    return !user ? next() : res.redirect('/');
}

const renderLoginPageHandler = (req, res) => res.render('auth/login');
const renderRegisterPageHandler = (req, res) => res.render('auth/register');

const loginHandler = async function (req, res) {
    let { username, password } = req.body;

    username = username.trim();
    password = password.trim();

    try {
        const user = await authService.login(username.toLowerCase(), password);
        const authToken = await authService.createToken(user);
        res.cookie(TOKEN_NAME, authToken, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        if (['ValidationError', 'CastError'].includes(error.constructor.name)) {
            const { errors } = error;
            const messages = Object.keys(errors)
                .map(path => errors[path].properties.message);
            res.locals.errors = messages;
        } else {
            res.locals.error = error.message;
        }

        res.status(error.statusCode ?? 500).render('auth/login', { username, password });
    }
};

const registerHandler = async function (req, res) {
    let { username, password, repeatPassword } = req.body;

    username = username.trim();
    password = password.trim();
    repeatPassword = repeatPassword.trim();

    try {
        await authService.register(username.toLowerCase(), password, repeatPassword);
        res.redirect('/auth/login');
    } catch (error) {
        if (['ValidationError', 'CastError'].includes(error.constructor.name)) {
            const { errors } = error;
            const messages = Object.keys(errors)
                .map(path => errors[path].properties.message);
            res.locals.errors = messages;
        } else {
            res.locals.error = error.message;
        }

        res.status(error.statusCode ?? 500).render('auth/register');
    }
};

const logoutHandler = function (req, res) {

    if (req.user) {
        res.clearCookie(TOKEN_NAME);
    } else {
        res.locals.error = 'Invalid session token.';
        res.status(403).render('404');
    }

    res.redirect('/auth/login');
};

router.get('/login', filterRequests, renderLoginPageHandler);
router.post('/login', filterRequests, loginHandler);
router.get('/register', filterRequests, renderRegisterPageHandler);
router.post('/register', filterRequests, registerHandler);
router.get('/logout', logoutHandler);

module.exports = router;