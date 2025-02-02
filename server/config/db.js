const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        console.log('Tentative de connexion à MongoDB:', config.mongoUri);
        await mongoose.connect(config.mongoUri);
        console.log('MongoDB connecté');
        
        // Vérifier si nous avons des utilisateurs
        const User = require('../models/user');
        const users = await User.find();
        console.log('Nombre d\'utilisateurs dans la base:', users.length);
    } catch (err) {
        console.error('Erreur de connexion MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB; 