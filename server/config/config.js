const config = {
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },
    database: {
        url: process.env.MONGOURL || 'mongodb://localhost:27017/your_database'
    },
    jwt: {
        privateKey: process.env.JWTPRIVATEKEY,
        salt: process.env.SALT || 10
    },
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3001'
    }
};

module.exports = config; 