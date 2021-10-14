const router = require('express').Router();

const cubeService = require('../services/cubeService');
const cubeAccessoryController = require('./cubeAccessoryController');

const renderCubeDifficultyOptions = require('../helpers/renderCubeDifficultyOptions');

const attachCubeMiddleware = require('../middlewares/attachCubeMiddleware');
const userStatusMiddleware = require('../middlewares/userStatusMiddleware');

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
    const { cube } = req;
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
    const { cube } = req;
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
        res.status(400).send(error.message);
    }
};

router.use(attachCubeMiddleware);
router.use(userStatusMiddleware);

router.get('/:cubeId/details', renderCubeDetailsPageHandler);
router.get('/:cubeId/edit', filterRequests, renderEditCubePageHandler);
router.post('/:cubeId/edit', filterRequests, editCubeHandler);
router.get('/:cubeId/delete', filterRequests, renderDeleteCubePageHandler);
router.post('/:cubeId/delete', filterRequests, deleteCubeHandler);
router.use('/:cubeId/accessories', filterRequests, cubeAccessoryController);
router.get('/create', filterRequests, renderCreateCubePageHandler);
router.post('/create', filterRequests, createCubeHandler);

module.exports = router;