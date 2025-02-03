const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        console.log('Tentative de connexion à MongoDB:', config.mongoURI);
        if (!config.mongoURI) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }
        await mongoose.connect(config.mongoURI);
        console.log('✅ Connecté à MongoDB');
        
        // Vérifier si nous avons des utilisateurs
        const User = require('../models/user');
        const users = await User.find();
        console.log('Nombre d\'utilisateurs dans la base:', users.length);
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB; 