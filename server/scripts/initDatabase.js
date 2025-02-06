require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/port-plaisance';
        await mongoose.connect(uri);
        console.log('✅ Connecté à MongoDB');

        // Vérifier si l'admin existe déjà
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

            await User.create({
                username: 'Admin',
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Compte admin créé');
        }

        console.log('✅ Base de données initialisée');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
};

initDatabase();