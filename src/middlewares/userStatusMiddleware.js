const userStatusMiddleware = function (req, res, next) {
    const { user, cube } = req;

    const isLoggedin = Boolean(user);

    req.hasPermissions = isLoggedin ? cube ? cube.creatorId === user._id : true : false;
    res.locals.isOwner = cube && user ? cube.creatorId === user._id : false;
    return next();
};

module.exports = userStatusMiddleware;