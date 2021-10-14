const router = require('express').Router();

const cubeService = require('../services/cubeService');
const cubeAccessoryController = require('./cubeAccessoryController');

const renderCubeDifficultyOptions = require('../helpers/renderCubeDifficultyOptions');

const userStatusMiddleware = async function (req, res, next) {
    const { user, params } = req;
    const { cubeId } = params;

    const cube = await cubeService.get(cubeId);

    const isLoggedin = Boolean(user);

    req.hasPermissions = isLoggedin ? cube ? cube.creatorId === user._id : true : false;
    res.locals.isOwner = cube && user ? cube.creatorId === user._id : false;
    return next();
};

const filterRequests = function (req, res, next) {
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
    const { cubeId } = req.params;
    const cube = await cubeService.get(cubeId);
    options = { ...cube };
    res.render('cubes/details', options);
}

const createCubeHandler = async function (req, res) {
    let { name, description, imageUrl, difficulty, creatorId } = req.body;

    name = name.trim().toLowerCase();
    description = description.trim().toLowerCase();
    imageUrl = imageUrl.trim();
    difficulty = Number(difficulty.trim());

    try {
        await cubeService.create(name, description, imageUrl, difficulty, creatorId);
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const renderEditCubePageHandler = async function (req, res) {
    const { cubeId } = req.params;
    const cube = await cubeService.get(cubeId);
    const difficulties = renderCubeDifficultyOptions(cube.difficulty);
    options = { ...cube, difficulties };
    res.render('cubes/edit', options);
};

const editCubeHandler = async function (req, res) {
    const { cubeId } = req.params;
    const data = req.body;

    data.name = data.name.trim().toLowerCase();
    data.description = data.description.trim().toLowerCase();
    data.imageUrl = data.imageUrl.trim();

    try {
        await cubeService.edit(cubeId, data);
        res.redirect(`/cubes/${cubeId}/details`);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const renderDeleteCubePageHandler = async function (req, res) {
    const { cubeId } = req.params;
    const cube = await cubeService.get(cubeId);
    const difficulties = renderCubeDifficultyOptions(cube.difficulty);
    options = { ...cube, difficulties };
    res.render('cubes/delete', options);
};

const deleteCubeHandler = async function (req, res) {
    const { cubeId } = req.params;

    try {
        await cubeService.remove(cubeId);
        res.redirect('/');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

router.get('/:cubeId/details', userStatusMiddleware, renderCubeDetailsPageHandler);
router.get('/:cubeId/edit', userStatusMiddleware, filterRequests, renderEditCubePageHandler);
router.post('/:cubeId/edit', userStatusMiddleware, filterRequests, editCubeHandler);
router.get('/:cubeId/delete', userStatusMiddleware, filterRequests, renderDeleteCubePageHandler);
router.post('/:cubeId/delete', userStatusMiddleware, filterRequests, deleteCubeHandler);
router.use('/:cubeId/accessories', userStatusMiddleware, filterRequests, cubeAccessoryController);
router.get('/create', userStatusMiddleware, filterRequests, renderCreateCubePageHandler);
router.post('/create', userStatusMiddleware, filterRequests, createCubeHandler);

module.exports = router;