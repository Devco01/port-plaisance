const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Vérifier l'URI MongoDB
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI non défini. Environnement:', process.env.NODE_ENV);
            process.exit(1);
        }

        // Log de l'URI (masqué pour la sécurité)
        const maskedURI = process.env.MONGODB_URI.replace(
            /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
            'mongodb+srv://[USER]:[PASSWORD]@'
        );
        console.log(`Tentative de connexion à MongoDB (${process.env.NODE_ENV}):`, maskedURI);

        // Tenter la connexion
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB');
    } catch (error) {
        console.error('❌ Erreur MongoDB détaillée:', {
            message: error.message,
            code: error.code,
            name: error.name
        });
        process.exit(1);
    }
};

module.exports = connectDB; 