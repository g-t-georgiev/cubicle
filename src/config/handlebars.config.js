const exphbs = require('express-handlebars');
const handlebars = exphbs.create({
    extname: 'hbs',
    helpers: {
        options(difficulty) {
            if (!difficulty) {
                return null;
            }

            const options = [];

            const text = {
                1: '1 - Very Easy',
                2: '2 - Easy',
                3: '3 - Medium (Standard 3x3)',
                4: '4 - Intermediate',
                5: '5 - Expert',
                6: '6 - Hardcore'
            };

            for (let index = 1; index <= 6; index++) {
                options.push(`<option value="${index}" ${difficulty === index ? 'selected' : ''}>${text[index]}</option>`);
            }

            return options.join('\n');
        }
    }
});
const path = require('path');

module.exports = (app) => {
    app.set('views', path.join(__dirname, '../views'));
    app.engine('hbs', handlebars.engine);
    app.set('view engine', 'hbs');
};