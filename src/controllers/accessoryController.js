const router = require('express').Router();

const accessoryService = require('../services/accessoryService');

const filterRequests = function (req, res, next) {
    const { user } = req;
    return user ? next() : res.redirect('/');
};

const renderAddAccessoryPageHandler = (req, res) => res.render('accessories/create');

const addAccessoryHandler = async (req, res) => {
    const { name, description, imageUrl } = req.body;
    
    try {
        await accessoryService.create(name, description, imageUrl);
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

router.get('/create', filterRequests, renderAddAccessoryPageHandler);
router.post('/create', filterRequests, addAccessoryHandler);

module.exports = router;