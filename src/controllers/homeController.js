const router = require('express').Router();

const cubeService = require('../services/cubeService');

let options = null;

const home = async function (req, res) {
    try {
        const cubes = await cubeService.getAll();
        options = { pageTitle: 'browser', cubes };
    } catch (error) {
        const { errors } = error;
        options = { pageTitle: 'browser', errors, cubes: [] }
    } finally {
        res.render('home', options);
    }
};

const about = (req, res) => res.render('home/about');

const search = async function (req, res) {
    let { search, from, to } = req.query;
     
    search = search.trim();
    from = from.trim();
    to = to.trim();

    try {
        const cubes = await cubeService.search(search, from, to);
        options = { pageTitle: 'search', search, from, to, cubes };
    } catch (error) {
        const { errors } = error;
        options = { pageTitle: 'search', errors, cubes: [] };
    } finally {
        res.render('home', options);
    }
};

router.get('/', home);
router.get('/about', about);
router.get('/search', search);

module.exports = router;