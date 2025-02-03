require('dotenv').config();
console.log('CheckAdmin - URL MongoDB:', process.env.MONGODB_URI);
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

async function checkAndCreateAdmin() {
    try {
        const mongoURI = process.env.MONGODB_URL || process.env.MONGODB_URI;
        console.log('🔄 Vérification du compte admin...');

        // Vérifier si l'admin existe
        let admin = await User.findOne({ email: 'admin@portplaisance.fr' });
        
        if (!admin) {
            console.log('➕ Création du compte admin...');
            admin = new User({
                email: 'admin@portplaisance.fr',
                username: 'admin',
                password: 'PortAdmin2024!',
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Admin créé avec succès');
        } else {
            console.log('✅ Admin existe déjà');
            // Mettre à jour le mot de passe
            admin.password = 'PortAdmin2024!';
            await admin.save();
            console.log('✅ Mot de passe admin mis à jour');
        }

        console.log('Détails admin:', {
            email: admin.email,
            role: admin.role,
            id: admin._id
        });

    } catch (error) {
        console.error('❌ Erreur:', error);
        throw error;
    }
}

module.exports = { checkAndCreateAdmin }; 