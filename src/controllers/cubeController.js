const router = require('express').Router();

const cubeService = require('../services/cubeService');
const cubeAccessoryController = require('./cubeAccessoryController');

const userStatusMiddleware = async function (req, res, next) {
    const { user, params } = req;
    const { cubeId } = params;

    const cube = cubeId ? await cubeService.get(cubeId) : null;

    const isLoggedin = Boolean(user);
    const isOwner = cube && isLoggedin ? cube.creatorId === user._id : false;

    req.cube = cube;

    req.hasPermissions = isLoggedin ? cube ? isOwner : true : false;
    res.locals.isOwner = isOwner;
    return next();
};

const routeGuard = function (req, res, next) {
    const { hasPermissions } = req;
    return hasPermissions ? next() : res.redirect('/');
};

let options = null;

const renderCreateCubePageHandler = (req, res) => {
    const { user } = req;

    const creatorId = user._id;
    options = { creatorId };

    res.render('cubes/create', options);
};

const renderCubeDetailsPageHandler = async function (req, res) {
    const { cube } = req;
    options = { ...cube };
    res.render('cubes/details', options);
}

const createCubeHandler = async function (req, res) {
    let { name, description, imageUrl, difficulty, creatorId } = req.body;

    name = name.trim();
    description = description.trim();
    imageUrl = imageUrl.trim();
    difficulty = Number(difficulty.trim());

    try {
        await cubeService.create(name.toLowerCase(), description, imageUrl, difficulty, creatorId);
        res.redirect('/');
    } catch (error) {
        const { errors } = error;

        const invalidFields = Object.keys(errors);
        // console.log(invalidFields);

        res.status(500).render('cubes/create', { errors, invalidFields, name, description, imageUrl, difficulty, creatorId });
    }
};

const renderEditCubePageHandler = async function (req, res) {
    // const { cubeId } = req.params;
    // const cube = await cubeService.get(cubeId);
    const { cube } = req;
    options = { ...cube };
    res.render('cubes/edit', options);
};

const editCubeHandler = async function (req, res) {
    const { cubeId } = req.params;
    let { name, description, imageUrl, difficulty, creatorId } = req.body;

    name = name.trim();
    description = description.trim();
    imageUrl = imageUrl.trim();
    difficulty = Number(difficulty.trim());

    try {
        await cubeService.edit(cubeId, { name: name.toLowerCase(), description, imageUrl, difficulty, creatorId });
        res.redirect(`/cubes/${cubeId}/details`);
    } catch (error) {
        const { errors } = error;

        const invalidFields = Object.keys(errors);
        // console.log(invalidFields);

        res.status(500).render('cubes/edit', { errors, invalidFields, name, description, imageUrl, difficulty, creatorId });
    }
};

const renderDeleteCubePageHandler = async function (req, res) {
    const { cube } = req;
    options = { ...cube };
    res.render('cubes/delete', options);
};

const deleteCubeHandler = async function (req, res) {
    const { cubeId } = req.params;

    try {
        await cubeService.remove(cubeId);
        res.redirect('/');
    } catch (error) {
        const { errors } = error;
        // console.log(errors);
        res.status(404).render('cubes/delete', { errors });
    }
};

router.get('/:cubeId/details', userStatusMiddleware, renderCubeDetailsPageHandler);
router.get('/:cubeId/edit', userStatusMiddleware, routeGuard, renderEditCubePageHandler);
router.post('/:cubeId/edit', userStatusMiddleware, routeGuard, editCubeHandler);
router.get('/:cubeId/delete', userStatusMiddleware, routeGuard, renderDeleteCubePageHandler);
router.post('/:cubeId/delete', userStatusMiddleware, routeGuard, deleteCubeHandler);
router.use('/:cubeId/accessories', userStatusMiddleware, routeGuard, cubeAccessoryController);
router.get('/create', userStatusMiddleware, routeGuard, renderCreateCubePageHandler);
router.post('/create', userStatusMiddleware, routeGuard, createCubeHandler);

module.exports = router;