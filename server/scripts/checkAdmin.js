require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

async function checkAndCreateAdmin() {
    try {
        console.log('MongoDB URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        // Vérifier si l'admin existe
        let admin = await User.findOne({ email: 'admin@portplaisance.fr' });
        
        if (!admin) {
            // Créer l'admin s'il n'existe pas
            admin = new User({
                email: 'admin@portplaisance.fr',
                username: 'admin',
                password: await bcrypt.hash('PortAdmin2024!', 10),
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Admin créé avec succès');
        } else {
            console.log('✅ Admin existe déjà');
            // Mettre à jour le mot de passe
            admin.password = await bcrypt.hash('PortAdmin2024!', 10);
            await admin.save();
            console.log('✅ Mot de passe admin mis à jour');
        }

        console.log('Détails admin:', {
            email: admin.email,
            role: admin.role,
            id: admin._id
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

checkAndCreateAdmin(); 