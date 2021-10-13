const router = require('express').Router();

const accessoryService = require('../services/accessoryService');

let options = null;

const isAuthenticated = (req, res, next) => {
    const { user } = req;

    if (!user) {
        return res.redirect('/');
    }

    next();
};

const renderAddAccessoryPageHandler = (req, res) => {
    const { isAuthenticated } = req;

    options = {
        isAuthenticated
    };

    res.render('accessories/create', options);
};

const addAccessoryHandler = async (req, res) => {
    const { name, description, imageUrl } = req.body;
    
    try {
        await accessoryService.create(name, description, imageUrl);
        res.redirect('/');
    } catch (err) {
        // console.log(err.message);
        res.status(500).send(err.message);
    }
};

router.get('/create', isAuthenticated, renderAddAccessoryPageHandler);
router.post('/create', isAuthenticated, addAccessoryHandler);

module.exports = router;