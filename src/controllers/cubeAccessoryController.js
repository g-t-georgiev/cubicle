const router = require('express').Router({ mergeParams: true });

const cubeService = require('../services/cubeService');
const accessoryService = require('../services/accessoryService');

let options = null;

const renderAddCubeAccessoryPageHandler = async function(req, res) {
    const { isAuthenticated, params: urlParams } = req;
    const { cubeId } = urlParams;

    const cube = await cubeService.get(cubeId);
    const cubeAccessoriesIds = cube.accessories?.map(accessory => accessory['_id']);

    const unattachedAccessories = await accessoryService.getAllWithout(cubeAccessoriesIds);

    options = {
        cube,
        unattachedAccessories,
        isAuthenticated
    }

    res.render('cubes/accessories/add', options);
}

const addCubeAccessoryHandler = async function(req, res) {
    const { cubeId } = req.params;
    const { accessory: accessoryId } = req.body;

    await cubeService.addAccessory(cubeId, accessoryId);
    res.redirect(`/cubes/${cubeId}/details`);
}

router.get('/add', renderAddCubeAccessoryPageHandler);
router.post('/add', addCubeAccessoryHandler);

module.exports = router;