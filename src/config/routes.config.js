const router = require('express').Router();

const homeController = require('../controllers/homeController');
const cubeController = require('../controllers/cubeController');
const accessoryController = require('../controllers/accessoryController');
const authController = require('../controllers/authController');

// Setup routes
router.use(homeController);
router.use('/cubes', cubeController);
router.use('/accessories', accessoryController);
router.use('/auth', authController);
router.use('*', (req, res) => {
    console.log('Nothing found.');
    res.status(404).render('404');
});

module.exports = router;