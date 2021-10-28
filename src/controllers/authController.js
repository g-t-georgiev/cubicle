const router = require('express').Router();

const authService = require('../services/authService');
const { TOKEN_NAME } = require('../config/constants');

const routeGuard = function (req, res, next) {
    const { user } = req;

    if (req.path.includes('login') || req.path.includes('register')) {
        return user ? res.redirect('/') : next();
    } else if (req.path.includes('logout')) {
        return !user ? res.redirect('/') : next();
    }
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
    res.clearCookie(TOKEN_NAME);
    res.redirect('/auth/login');
};

router.get('/login', routeGuard, renderLoginPageHandler);
router.post('/login', routeGuard, loginHandler);
router.get('/register', routeGuard, renderRegisterPageHandler);
router.post('/register', routeGuard, registerHandler);
router.get('/logout', routeGuard, logoutHandler);

module.exports = router;