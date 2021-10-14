const jwt = require('../utils/jwt');
const { TOKEN_NAME } = require('../config/constants');

function validateSession(req, res, next) {
    const token = req.cookies[TOKEN_NAME];

    if (!token) {
        // No jwt token found in reques
        // So isAuthenticated is set to false
        res.locals.isAuthenticated = false;
        return next();
    }

    // If jwt token found, validate it
    return jwt.verify(token)
        .then(decodedToken => {
            // Attach user to the request
            req.user = decodedToken;
            res.locals.isAuthenticated = true;
            next();
        })
        .catch(error => {
            // Delete session cookie
            // console.log(err);
            res.locals.isAuthenticated = false;
            res.clearCookie(TOKEN_NAME);
            next(error);
        });
}

module.exports = function (app) {
    app.use(validateSession);
};