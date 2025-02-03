require('dotenv').config();

const config = {
    port: process.env.PORT || 8000,
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/port-plaisance',
    jwtSecret: process.env.JWT_SECRET || 'votre_secret_jwt',
    apiUrl: process.env.API_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:8000'
};

module.exports = config; 