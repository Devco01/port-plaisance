require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
    try {
        console.log('Démarrage de l\'initialisation de la base de données...');
        
        // Vérifier les variables d'environnement requises
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI manquant dans les variables d\'environnement');
        }
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            throw new Error('ADMIN_EMAIL ou ADMIN_PASSWORD manquant dans les variables d\'environnement');
        }

        // Connexion à MongoDB avec gestion des erreurs
        console.log('Tentative de connexion à MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // Timeout après 5 secondes
        });
        console.log('✅ Connecté à MongoDB');

        // Vérifier si l'admin existe déjà
        console.log('Vérification du compte admin...');
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        
        if (!adminExists) {
            console.log('Création du compte admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

            await User.create({
                username: 'Admin',
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Compte admin créé');
        } else {
            console.log('✅ Compte admin existe déjà');
        }

        console.log('✅ Base de données initialisée avec succès');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
};

// Gérer les erreurs non capturées
process.on('unhandledRejection', (error) => {
    console.error('❌ Erreur non gérée:', error);
    process.exit(1);
});

initDatabase();