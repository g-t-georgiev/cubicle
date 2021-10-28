const router = require('express').Router();

const cubeService = require('../services/cubeService');
const cubeAccessoryController = require('./cubeAccessoryController');

const decorateRequest = async function (req, res, next) {
    const {
        user,
        params: { cubeId }
    } = req;

    const cube = cubeId ? await cubeService.get(cubeId) : null;

    const isLoggedin = Boolean(user);
    const isOwner = cube && isLoggedin ? cube.creatorId === user.id : false;

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

const renderCreateCubePageHandler = (req, res) => res.render('cubes/create');

const renderCubeDetailsPageHandler = async function (req, res) {
    const { cube } = req;
    options = { ...cube };
    res.render('cubes/details', options);
}

const createCubeHandler = async function (req, res) {
    let {
        user,
        body: {
            name,
            description,
            imageUrl,
            difficulty
        }
    } = req;

    let creatorId = user.id;

    name = name.trim();
    description = description.trim();
    imageUrl = imageUrl.trim();
    difficulty = Number(difficulty.trim());

    try {
        await cubeService.create(name.toLowerCase(), description, imageUrl, difficulty, creatorId);
        res.redirect('/');
    } catch (error) {
        if (['ValidationError', 'CastError'].includes(error.constructor.name)) {
            const { errors } = error;
            const messages = Object.keys(errors)
                .map(path => errors[path].properties.message);
            res.locals.errors = messages;
        } else {
            res.locals.error = error.message;
        }

        options = { name, description, imageUrl, difficulty, creatorId };

        res.status(error.statusCode ?? 500).render('cubes/create', options);
    }
};

const renderEditCubePageHandler = async function (req, res) {
    const { cube } = req;
    options = { ...cube };
    res.render('cubes/edit', options);
};

const editCubeHandler = async function (req, res) {
    let {
        user,
        params: { cubeId },
        body: {
            name,
            description,
            imageUrl,
            difficulty
        }
    } = req;

    let creatorId = user.id;

    name = name.trim();
    description = description.trim();
    imageUrl = imageUrl.trim();
    difficulty = Number(difficulty.trim());

    try {
        await cubeService.edit(cubeId, { name: name.toLowerCase(), description, imageUrl, difficulty, creatorId });
        res.redirect(`/cubes/${cubeId}/details`);
    } catch (error) {
        if (['ValidationError', 'CastError'].includes(error.constructor.name)) {
            const { errors } = error;
            const messages = Object.keys(errors)
                .map(path => errors[path].properties.message);
            res.locals.errors = messages;
        } else {
            res.locals.error = error.message;
        }

        options = { name, description, imageUrl, difficulty, creatorId };

        res.status(error.statusCode ?? 500).render('cubes/edit', options);
    }
};

const renderDeleteCubePageHandler = async function (req, res) {
    const { cube } = req;
    options = { ...cube };
    res.render('cubes/delete', options);
};

const deleteCubeHandler = async function (req, res) {
    const {
        cube,
        params: { cubeId }
    } = req;

    try {
        await cubeService.remove(cubeId);
        res.redirect('/');
    } catch (error) {
        if (['ValidationError', 'CastError'].includes(error.constructor.name)) {
            const { errors } = error;
            const messages = Object.keys(errors)
                .map(path => errors[path].properties.message);
            res.locals.errors = messages;
        } else {
            res.locals.error = error.message;
        }

        options = { ...cube };

        res.status(error.statusCode ?? 500).render('cubes/delete', options);
    }
};

router.use(decorateRequest);

router.get('/:cubeId/details', renderCubeDetailsPageHandler);
router.get('/:cubeId/edit', routeGuard, renderEditCubePageHandler);
router.post('/:cubeId/edit', routeGuard, editCubeHandler);
router.get('/:cubeId/delete', routeGuard, renderDeleteCubePageHandler);
router.post('/:cubeId/delete', routeGuard, deleteCubeHandler);
router.use('/:cubeId/accessories', routeGuard, cubeAccessoryController);
router.get('/create', routeGuard, renderCreateCubePageHandler);
router.post('/create', routeGuard, createCubeHandler);

module.exports = router;