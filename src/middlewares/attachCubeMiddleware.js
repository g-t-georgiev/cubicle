const cubeService = require('../services/cubeService');

const attachCubeMiddleware = async function (req, res, next) {
    try {
        const { cubeId } = req.params;
        const cube = await cubeService.get(cubeId);
        cube.name = cube.name?.[0] + cube.name?.slice(1);
        req.cube = cube;
        return next();
    } catch (error) {
        console.log(error.message);
        res.status(404).render('404');
    }
}

module.exports = attachCubeMiddleware;