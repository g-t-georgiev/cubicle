const app = require('express')();

const env = process.env.NODE_ENV ?? 'development';

const config = require('./config/config')[env];
const routes = require('./config/routes');
const connectDB = require('./config/database');

// console.log(`PORT: ${config.port}`);
// console.log(`DB: ${config.db}`);

require('./config/express')(app);

app.use(routes);

connectDB(config.db)
    .then((response) => {
        // console.log(response);
        app.listen(config.port, console.log.bind(console, `Application is listening on port ${config.port}! Click here to open http://localhost:${config.port}/`));
    })
    .catch(err => {
        console.log('Failed to connect to database due to ' + err);
    });