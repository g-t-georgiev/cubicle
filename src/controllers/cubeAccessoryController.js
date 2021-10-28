const router = require('express').Router({ mergeParams: true });

const cubeService = require('../services/cubeService');
const accessoryService = require('../services/accessoryService');

let options = null;

const renderAddCubeAccessoryPage = async function(req, res) {
    const { cubeId } = req.params;

    const cube = await cubeService.get(cubeId);
    
    const cubeAccessoriesIds = cube.accessories?.map(accessory => accessory['_id']);

    const unattachedAccessories = await accessoryService.getAllWithout(cubeAccessoriesIds);

    cube.name = cube.name.toUpperCase();
    options = { cube, unattachedAccessories };

    res.render('cubes/accessories/add', options);
}

const addCubeAccessory = async function(req, res) {
    const { cubeId } = req.params;
    const { accessory: accessoryId } = req.body;

    await cubeService.addAccessory(cubeId, accessoryId);
    res.redirect(`/cubes/${cubeId}/details`);
}

router.get('/add', renderAddCubeAccessoryPage);
router.post('/add', addCubeAccessory);

module.exports = router;