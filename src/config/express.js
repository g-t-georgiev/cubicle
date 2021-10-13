const express = require('express');
const path = require('path');
const { urlencoded } = express;
const cookieParser = require('cookie-parser');

const handlebars = require('./handlebars');
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = (app) => {
    // Setup cookie parser
    app.use(cookieParser());

    // Setup user authentication
    authMiddleware(app);

    // Setup handlebars
    handlebars(app);

    // Setup static files
    app.use('/static', express.static(path.join(__dirname, '../public')));

    // Setup form request body parsing
    app.use(urlencoded({ extended: true }));
};