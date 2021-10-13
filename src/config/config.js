const env = {
    development: {
        port: process.env.PORT ?? 3000,
        db: 'mongodb://localhost:27017/cubicle'
    },
    production: {
        port: process.env.PORT,
        db: ''
    }
};