require('dotenv').config();
console.log('ImportData - URL MongoDB:', process.env.MONGODB_URL);
const mongoose = require('mongoose');
const Catway = require('../models/catway');
const User = require('../models/user');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const Reservation = require('../models/reservation');

async function importData() {
    try {
        // Connexion à MongoDB
        const mongoURI = process.env.MONGODB_URL || process.env.MONGODB_URI;
        await mongoose.connect(mongoURI);
        console.log('Connecté à MongoDB');

        // Créer l'admin par défaut
        let admin = await User.findOne({ email: 'admin@portplaisance.fr' });
        if (!admin) {
            admin = new User({
                email: 'admin@portplaisance.fr',
                username: 'admin',
                password: await bcrypt.hash('PortAdmin2024!', 10),
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Admin créé');
        }

        // Importer les données
        const catwaysData = JSON.parse(
            await fs.readFile(path.join(__dirname, '../../data/catways.json'), 'utf-8')
        );
        await Catway.deleteMany({});
        await Catway.insertMany(catwaysData);
        console.log('✅ Catways importés');

        console.log('✅ Import terminé');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

importData(); 