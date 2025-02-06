require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

async function resetAdmin() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@portplaisance.fr';
        
        // Supprimer l'ancien admin
        await User.deleteOne({ email: adminEmail });
        console.log('🗑️ Ancien admin supprimé');

        // Créer le nouvel admin
        const admin = await User.create({
            username: 'Admin',
            email: adminEmail,
            password: process.env.ADMIN_PASSWORD || 'PortAdmin2024!',
            role: 'admin'
        });

        console.log('✨ Nouvel admin créé:');
        console.log('Email:', admin.email);
        console.log('Username:', admin.username);
        console.log('Role:', admin.role);

        // Déconnexion
        await mongoose.disconnect();
        console.log('✅ Déconnecté de MongoDB');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

resetAdmin(); 