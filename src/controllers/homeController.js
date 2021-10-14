const router = require('express').Router();

const cubeService = require('../services/cubeService');

let options = null;

const home = async function (req, res) {
    const cubes = await cubeService.getAll()
        .map(cube => {
            const { name } = cube;
            cube.name = name[0] + name.slice(1);
            return cube;
        });

    options = { pageTitle: 'BROWSER', cubes };
    res.render('index', options);
};

const about = (req, res) => res.render('about');

const search = async function (req, res) {
    const { search, from, to} = req.query;
    
    const cubes = await cubeService.search(search, from, to)
        .map(cube => {
            const { name } = cube;
            cube.name = name[0] + name.slice(1);
            return cube;
        });

    options = {
        pageTitle: 'SEARCH',
        search: search.trim(),
        from: from.trim(),
        to: to.trim(),
        cubes
    };

    res.render('index', options);
};

router.get('/', home);
router.get('/about', about);
router.get('/search', search);

module.exports = router;