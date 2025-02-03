require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connexion à MongoDB établie');

        // Nettoyer la base de données
        await Promise.all([
            User.deleteMany({}),
            Catway.deleteMany({}),
            Reservation.deleteMany({})
        ]);

        // Créer un admin par défaut
        const adminPassword = await bcrypt.hash('Admin123!', 10);
        const admin = await User.create({
            username: 'admin',
            email: 'admin@port-russell.com',
            password: adminPassword,
            role: 'admin'
        });

        // Créer quelques catways
        const catways = await Catway.insertMany([
            {
                catwayNumber: 'A1',
                catwayType: 'long',
                catwayState: 'disponible'
            },
            {
                catwayNumber: 'A2',
                catwayType: 'short',
                catwayState: 'disponible'
            }
            // Ajoutez d'autres catways selon vos besoins
        ]);

        console.log('Base de données initialisée avec succès');
        console.log('Identifiants admin :', {
            email: 'admin@port-russell.com',
            password: 'Admin123!'
        });

        process.exit(0);
    } catch (error) {
        console.error('Erreur lors de l\'initialisation :', error);
        process.exit(1);
    }
};

seedDatabase(); 