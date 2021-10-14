const attachCubeMiddleware = async function (req, res, next) {
    try {
        const { cubeId } = req.params;
        const cube = await cubeService.get(cubeId);
        req.cube = cube;
        return next();
    } catch (error) {
        console.log(error.message);
        res.status(404).render('404');
    }
}

module.exports = attachCubeMiddleware;