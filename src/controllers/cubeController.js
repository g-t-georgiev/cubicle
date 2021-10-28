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
    next();
};

const routeGuard = function (req, res, next) {
    const { hasPermissions } = req;
    return hasPermissions ? next() : res.redirect('/');
};

let options = null;

const renderCreateCubePage = (req, res) => res.render('cubes/create');

const renderCubeDetailsPage = async function (req, res) {
    const { cube } = req;
    options = { ...cube };
    res.render('cubes/details', options);
}

const createCube = async function (req, res) {
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

const renderEditCubePage = async function (req, res) {
    const { cube } = req;
    options = { ...cube };
    res.render('cubes/edit', options);
};

const editCube = async function (req, res) {
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

const renderDeleteCubePage = async function (req, res) {
    const { cube } = req;
    options = { ...cube };
    res.render('cubes/delete', options);
};

const deleteCube = async function (req, res) {
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

router.get('/:cubeId/details', decorateRequest, renderCubeDetailsPage);
router.get('/:cubeId/edit', decorateRequest, routeGuard, renderEditCubePage);
router.post('/:cubeId/edit', decorateRequest, routeGuard, editCube);
router.get('/:cubeId/delete', decorateRequest, routeGuard, renderDeleteCubePage);
router.post('/:cubeId/delete', decorateRequest, routeGuard, deleteCube);
router.use('/:cubeId/accessories', decorateRequest, routeGuard, cubeAccessoryController);
router.get('/create', decorateRequest, routeGuard, renderCreateCubePage);
router.post('/create', decorateRequest, routeGuard, createCube);

module.exports = router;