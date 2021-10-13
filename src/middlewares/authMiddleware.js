const jwt = require('../utils/jwt');
const { TOKEN_NAME } = require('../config/constants');

function validateSession(req, res, next) {
    const token = req.cookies[TOKEN_NAME];

    if (!token) {
        // No jwt token found in reques
        // So isAuthenticated is set to false
        req.isAuthenticated = false;
        return next();
    }

    // If jwt token found, validate it
    return jwt.verify(token)
        .then(decodedToken => {
            // Attach user to the request
            req.user = decodedToken;
            req.isAuthenticated = true;
            next();
        })
        .catch(err => {
            // Delete session cookie
            // console.log(err);
            req.isAuthenticated = false;
            res.clearCookie(TOKEN_NAME);
            next();
        });
}

module.exports = function (app) {
    app.use(validateSession);
};