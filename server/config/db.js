const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Vérifier l'URI MongoDB
        const mongoURI = process.env.MONGODB_URL || process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('Aucune URL MongoDB définie (MONGODB_URL ou MONGODB_URI)');
        }

        // Log de l'URI (masqué pour la sécurité)
        const maskedURI = mongoURI.replace(
            /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
            'mongodb+srv://[USER]:[PASSWORD]@'
        );
        console.log(`Tentative de connexion à MongoDB via ${process.env.MONGODB_URL ? 'MONGODB_URL' : 'MONGODB_URI'}:`, maskedURI);

        // Tenter la connexion
        await mongoose.connect(mongoURI);
        console.log('✅ Connecté à MongoDB');
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
