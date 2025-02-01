const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb+srv://testuser:DocQ9byiRq4nfkAe@port-de-plaisance.hcmg0.mongodb.net/?retryWrites=true&w=majority&appName=port-de-plaisance';
        
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connecté');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
