require('dotenv').config();

const config = {
    port: process.env.PORT || 8000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/port-plaisance',
    jwtSecret: process.env.JWT_SECRET || 'PortRussell2024SecretKey',
    apiUrl: process.env.API_URL || 'http://localhost:8000'
};

module.exports = config; 