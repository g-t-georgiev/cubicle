const exphbs = require('express-handlebars');
const handlebars = exphbs.create({ extname: 'hbs' });
const path = require('path');

module.exports = (app) => {
    app.set('views', path.join(__dirname, '../views'));
    app.engine('hbs', handlebars.engine);
    app.set('view engine', 'hbs');
};