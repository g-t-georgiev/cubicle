const router = require('express').Router();

const accessoryService = require('../services/accessoryService');

const filterRequests = function (req, res, next) {
    const { user } = req;
    return user ? next() : res.redirect('/');
};

const renderAddAccessoryPageHandler = (req, res) => res.render('accessories/create');

const addAccessoryHandler = async (req, res) => {
    let { name, description, imageUrl } = req.body;

    name = name.trim();
    description = description.trim();
    imageUrl = imageUrl.trim();
    
    try {
        await accessoryService.create(name.toLowerCase(), description, imageUrl);
        res.redirect('/');
    } catch (error) {
        const { errors } = error;

        const invalidFields = Object.keys(errors);
        console.log(invalidFields);

        res.status(500).render('accessories/create', { errors, invalidFields, name, description, imageUrl });
    }
};

router.get('/create', filterRequests, renderAddAccessoryPageHandler);
router.post('/create', filterRequests, addAccessoryHandler);

module.exports = router;