const router = require('express').Router();

const cubeService = require('../services/cubeService');

let options = null;

const home = async function (req, res) {
    res.locals.pageTitle = 'browser';

    try {
        const cubes = await cubeService.getAll() ?? [];
        options = { cubes };
    } catch (error) {
        res.locals.error = error.message;
        options = { cubes: [] }
    } finally {
        res.render('home', options);
    }
};

const about = (req, res) => res.render('home/about');

const search = async function (req, res) {
    let { search, from, to } = req.query;

    res.locals.pageTitle = 'search';
     
    search = search.trim();
    from = from.trim();
    to = to.trim();

    try {
        const cubes = await cubeService.search(search, from, to) ?? [];
        options = { search, from, to, cubes };
    } catch (error) {
        res.locals.error = error.message;
        options = { cubes: [] };
    } finally {
        res.render('home', options);
    }
};

router.get('/', home);
router.get('/about', about);
router.get('/search', search);

module.exports = router;