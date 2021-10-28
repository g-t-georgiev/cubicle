const router = require('express').Router();

const accessoryService = require('../services/accessoryService');

const routeGuard = function (req, res, next) {
    const { user } = req;
    return user ? next() : res.redirect('/');
};

const renderAddAccessoryPageHandler = (req, res) => res.render('accessories/create');

const addAccessoryHandler = async (req, res) => {
    let { name, description, imageUrl } = req.body;

    name = name.trim();
    description = description.trim();
    imageUrl = imageUrl.trim();
    
    let options;

    try {
        await accessoryService.create(name.toLowerCase(), description, imageUrl);
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
        
        options = { name, description, imageUrl };
        res.status(500).render('accessories/create', options);
    }
};

router.get('/create', routeGuard, renderAddAccessoryPageHandler);
router.post('/create', routeGuard, addAccessoryHandler);

module.exports = router;