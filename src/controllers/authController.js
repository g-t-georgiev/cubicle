const router = require('express').Router();

const authService = require('../services/authService');
const { TOKEN_NAME } = require('../config/constants');

const isAuthenticated = function (req, res, next) {
    const { isAuthenticated } = req;

    if (isAuthenticated) {
        res.redirect('/');
        return;
    }

    next();
}

router.get('/login', isAuthenticated, (req, res) => {
    const { isAuthenticated } = req;

    options = {
        isAuthenticated
    };

    res.render('auth/login', options);
});

router.post('/login', isAuthenticated, (req, res) => {
    let { username, password } = req.body;

    username = username.trim();
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
});

router.get('/register', isAuthenticated, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isAuthenticated, (req, res) => {
    let {username, password, repeatPassword} = req.body;

    username = username.trim();
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
});

router.get('/logout', (req, res) => {
    const { isAuthenticated } = req;

    try {
        authService.logout(isAuthenticated);
        res.cookie(TOKEN_NAME, '', {
            httpOnly: true,
            maxAge: -1
        });
        res.status(204);
    } catch (err) {
        console.log(err);
    } finally {
        res.redirect('/auth/login');
    }
});

module.exports = router;