const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Vérifier l'URI MongoDB
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI non défini');
        }

        // Log de l'URI (masqué pour la sécurité)
        const maskedURI = process.env.MONGODB_URI.replace(
            /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
            'mongodb+srv://[USER]:[PASSWORD]@'
        );
        console.log(`Tentative de connexion à MongoDB (${process.env.NODE_ENV}):`, maskedURI);

        // Tenter la connexion
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Connecté à MongoDB');
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB; 