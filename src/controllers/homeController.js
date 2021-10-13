const router = require('express').Router();

const cubeService = require('../services/cubeService');

let options = null;

const home = async function (req, res) {
    const { isAuthenticated } = req;
    
    const cubes = await cubeService.getAll();

    options = {
        pageTitle: 'BROWSER',
        cubes,
        isAuthenticated
    };

    res.render('index', options);
};

const about = function (req, res) {
    const { isAuthenticated } = req;

    options = {
        isAuthenticated
    };

    res.render('about', options);
};

const search = async function (req, res) {
    const { isAuthenticated } = req;
    const { search, from, to} = req.query;
    
    const cubes = await cubeService.search(search, from, to);

    options = {
        pageTitle: 'SEARCH',
        search: search.trim(),
        from: from.trim(),
        to: to.trim(),
        cubes,
        isAuthenticated
    };

    res.render('index', options);
};

router.get('/', home);
router.get('/about', about);
router.get('/search', search);

module.exports = router;