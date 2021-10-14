const handlebars = require('express-handlebars');
const path = require('path');

module.exports = (app) => {
    // Setup default path to views folder
    app.set('views', path.join(__dirname, '../views'));

    // Setup view engine
    app.engine('hbs', handlebars({ extname: 'hbs' }));

    app.set('view engine', 'hbs');
};