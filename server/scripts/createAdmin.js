const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Vérifier si un admin existe déjà
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            console.log('Un administrateur existe déjà');
            process.exit(0);
        }

        // Créer l'administrateur
        const admin = new User({
            username: 'admin',
            email: 'admin@port-russell.com',
            password: process.env.ADMIN_PASSWORD || 'Admin123!',
            role: 'admin',
            nom: 'Admin',
            prenom: 'Port Russell'
        });

        await admin.save();
        console.log('Administrateur créé avec succès');
        console.log('Email:', admin.email);
        console.log('Mot de passe:', process.env.ADMIN_PASSWORD || 'Admin123!');

    } catch (error) {
        console.error('Erreur lors de la création de l\'administrateur:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createAdminUser(); 