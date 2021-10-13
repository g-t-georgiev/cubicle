const router = require('express').Router();

const cubeService = require('../services/cubeService');
const cubeAccessoryController = require('./cubeAccessoryController');

const renderCubeDifficultyOptions = require('../helpers/renderCubeDifficultyOptions');

const isAuthenticated = function (req, res, next) {
    const { user } = req;

    if (!user) {
        return res.redirect('/');
    }

    next();
};

const isAuthorized = function (req, res, next) {
    const { user, params: urlParams } = req;

    const { cubeId } = urlParams;
    const userId = user?._id;

    return cubeService.get(cubeId)
        .then(cube => {
            const { creatorId } = cube;

            if (!creatorId || creatorId !== userId) {
                return Promise.reject('You do not have permission to modify this resource.');
            }

            req.cube = cube;

            return next();
        })
        .catch(err => {
            console.log(err.message);
            return res.redirect(`/cubes/${cubeId}/details`);
        });
};

let options = null;

const renderCreateCubePageHandler = (req, res) => {
    const { isAuthenticated, user } = req;

    options = {
        isAuthenticated,
        creatorId: user._id
    };

    res.render('cubes/create', options);
};

const renderCubeDetailsPageHandler = async function (req, res) {
    const { isAuthenticated, params: urlParams } = req;
    
    const userId = req.user?._id;
    const { cubeId } = urlParams;

    try {
        const cube = await cubeService.get(cubeId);

        const { creatorId } = cube;

        options = {
            ...cube,
            isAuthenticated,
            canEdit: isAuthenticated && userId === creatorId
        };

        res.render('cubes/details', options);
    } catch(err) {
        res.status.render('404');
    }
};

const createCubeHandler = async function (req, res) {
    const { name, description, imageUrl, difficultyLvl, creatorId } = req.body;

    try {
        await cubeService.create(name, description, imageUrl, difficultyLvl, creatorId);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const renderEditCubePageHandler = async function (req, res) {
    const { isAuthenticated, params: urlParams, cube } = req;

    const { cubeId } = urlParams;

    options = {
        ...cube,
        isAuthenticated,
        difficultyLevels: renderCubeDifficultyOptions(cube.difficultyLvl)
    };

    res.render('cubes/edit', options);
};

const editCubeHandler = async function (req, res) {
    const { cubeId } = req.params;
    const data = req.body;

    try {
        await cubeService.edit(cubeId, data);
        res.redirect(`/cubes/${cubeId}/details`);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const renderDeleteCubePageHandler = async function (req, res) {
    const { isAuthenticated, params: urlParams, cube } = req;

    const { cubeId } = urlParams;

    options = {
        ...cube,
        isAuthenticated,
        difficultyLevels: renderCubeDifficultyOptions(cube.difficultyLvl)
    };

    res.render('cubes/delete', options);
};

const deleteCubeHandler = async function (req, res) {
    const { cubeId } = req.params;

    try {
        await cubeService.remove(cubeId);
        res.redirect('/');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

router.get('/:cubeId/details', renderCubeDetailsPageHandler);
router.get('/:cubeId/edit', isAuthenticated, isAuthorized, renderEditCubePageHandler);
router.post('/:cubeId/edit', isAuthenticated, isAuthorized, editCubeHandler);
router.get('/:cubeId/delete', isAuthenticated, isAuthorized, renderDeleteCubePageHandler);
router.post('/:cubeId/delete', isAuthenticated, isAuthorized, deleteCubeHandler);
router.use('/:cubeId/accessories', isAuthenticated, isAuthorized, cubeAccessoryController);
router.get('/create', isAuthenticated, renderCreateCubePageHandler);
router.post('/create', isAuthenticated, createCubeHandler);

module.exports = router;