require('dotenv').config();

const config = {
    port: process.env.PORT || 8000,
    mongoURI: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET || 'votre_secret_jwt',
    apiUrl: process.env.API_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:8000',
    init: () => {
        console.log('Environment variables:');
        console.log('PORT:', process.env.PORT);
        console.log('MONGODB_URI:', process.env.MONGODB_URI);
        console.log('JWT_SECRET:', process.env.JWT_SECRET ? '[SET]' : '[NOT SET]');
    }
};

config.init();

module.exports = config; 