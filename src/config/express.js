const express = require('express');
const path = require('path');
const { urlencoded } = express;
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const handlebars = require('./handlebars');
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = (app) => {
    app.use(cookieParser());
    authMiddleware(app);
    handlebars(app);
    app.use('/static', express.static(path.join(__dirname, '../public')));
    app.use(urlencoded({ extended: true }));
    app.use(routes);
};