const jwt = require('../utils/jwt');
const { TOKEN_NAME } = require('../config/constants');

async function validateSession(req, res, next) {
    const authToken = req.cookies[TOKEN_NAME];

    if (!authToken) {
        return next();
    }

    try {
        const decodedToken = await jwt.verify(token);

        req.user = decodedToken;
        res.locals.user = decodedToken;
        next();
    } catch (error) {
        res.clearCookie(TOKEN_NAME);
        next(error);
    }
}

module.exports = function (app) {
    app.use(validateSession);
};