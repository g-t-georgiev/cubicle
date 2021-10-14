const userStatusMiddleware = function (req, res, next) {
    const { user, cube } = req;
    req.hasPermissions = cube.creatorId === user?._id;
    res.locals.isOwner = cube.creatorId === user?._id;
    return next();
};

module.exports = userStatusMiddleware;