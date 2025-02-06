require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@portplaisance.fr';
        
        // Rechercher l'admin
        const admin = await User.findOne({ email: adminEmail });
        if (admin) {
            console.log('✅ Admin trouvé:');
            console.log('Email:', admin.email);
            console.log('Username:', admin.username);
            console.log('Role:', admin.role);
        } else {
            console.log('❌ Admin non trouvé');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

checkAdmin();
