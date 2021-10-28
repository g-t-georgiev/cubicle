const app = require('express')();

const env = process.env.NODE_ENV ?? 'development';

const config = require('./config')[env];
const connectDB = require('./config/database.config');

require('./config/express.config')(app);

connectDB(config.db)
    .then((_) => {
        app.listen(config.port, console.log.bind(console, `Application is listening on port ${config.port}! Click here to open http://localhost:${config.port}/`));
    })
    .catch(err => {
        console.log('Failed to connect to database due to ' + err);
    });