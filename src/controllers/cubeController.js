const router = require('express').Router();

const cubeService = require('../services/cubeService');
const cubeAccessoryController = require('./cubeAccessoryController');

const renderCubeDifficultyOptions = require('../helpers/renderCubeDifficultyOptions');

const userStatusMiddleware = async function (req, res, next) {
    const { user, params } = req;
    const { cubeId } = params;

    const cube = cubeId ? await cubeService.get(cubeId) : null;

    const isLoggedin = Boolean(user);
    const isOwner = cube && isLoggedin ? cube.creatorId === user._id : false;

    if (isLoggedin) {
        req.cube = cube;
    }

    req.hasPermissions = isLoggedin ? cube ? isOwner : true : false;
    res.locals.isOwner = isOwner;
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
    // const { cubeId } = req.params;
    // const cube = await cubeService.get(cubeId);

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

        const difficulties = renderCubeDifficultyOptions(difficulty);

        res.status(500).render('cubes/create', { errors, invalidFields, name, description, imageUrl, difficulties, creatorId });
    }
};

const renderEditCubePageHandler = async function (req, res) {
    // const { cubeId } = req.params;
    // const cube = await cubeService.get(cubeId);
    const { cube } = req;
    const difficulties = renderCubeDifficultyOptions(cube.difficulty);
    options = { ...cube, difficulties };
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

        const difficulties = renderCubeDifficultyOptions(difficulty);

        const invalidFields = Object.keys(errors);
        // console.log(invalidFields);

        res.status(500).render('cubes/edit', { errors, invalidFields, name, description, imageUrl, difficulties, creatorId });
    }
};

const renderDeleteCubePageHandler = async function (req, res) {
    // const { cubeId } = req.params;
    // const cube = await cubeService.get(cubeId);
    const { cube } = req;
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
        const { errors } = error;
        // console.log(errors);
        res.status(404).render('cubes/delete', { errors });
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