const handlebars = require('express-handlebars');
const path = require('path');

module.exports = (app) => {
    // Setup default path to views folder
    app.set('views', path.join(__dirname, '../views'));

    // Setup view engine
    app.engine('hbs', handlebars({
        extname: 'hbs',
        helpers: {
            'nav': function (isAuthenticated) {
                return `<header>
                    <ul>
                        <li>
                            <a href="/">
                                <img class="logo" src="/static/images/logo.png">
                            </a>
                        </li>
                        <li>
                            <a href="/">Browse</a>
                        </li>
                        <li>
                            <a href="/about">About</a>
                        </li>
                        ${
                            isAuthenticated
                            ? `
                            <li>
                                <a href="/cubes/create">Add Cube</a>
                            </li>
                            <li>
                                <a href="/accessories/create">Add Accessory</a>
                            </li>
                            <li>
                                <a href="/auth/logout">Logout</a>
                            </li>`
                            : `
                            <li>
                                <a href="/auth/login">Login</a>
                            </li>
                            <li>
                                <a href="/auth/register">Register</a>
                            </li>`
                        }
                    </ul>
                </header>`
            }
        }
    }));

    app.set('view engine', 'hbs');
};