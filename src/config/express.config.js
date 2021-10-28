module.exports = (app) => {
    const path = require('path');
    const express = require('express');

    app.use(require('cookie-parser')());
    require('../middlewares/authMiddleware')(app);
    require('./handlebars.config')(app);
    app.use('/static', express.static(path.join(__dirname, '../public')));
    app.use(express.urlencoded({ extended: true }));
    app.use(require('./routes.config'));
};