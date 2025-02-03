const mongoose = require('mongoose');
const Catway = require('../models/catway');
const User = require('../models/user');
require('dotenv').config({ path: '.env' });
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const Reservation = require('../models/reservation');
const reservationSchema = require('../models/reservation').schema;

async function importData() {
    try {
        // Connexion à MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/port-plaisance';
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

        // Lire et importer les catways
        const catwaysData = JSON.parse(
            await fs.readFile(path.join(__dirname, '../../data/catways.json'), 'utf-8')
        );
        await Catway.deleteMany({});
        await Catway.insertMany(catwaysData);
        console.log('✅ Catways importés');

        // Lire et importer les réservations
        const reservationsData = JSON.parse(
            await fs.readFile(path.join(__dirname, '../../data/reservations.json'), 'utf-8')
        );
        await Reservation.deleteMany({});
        
        // Désactiver temporairement la validation
        const originalValidate = reservationSchema.path('startDate').validators[0];
        reservationSchema.path('startDate').validators = [];
        
        // Formater les données de réservation
        const formattedReservations = reservationsData.map(res => ({
            catwayNumber: res.catwayNumber,
            clientName: res.clientName,
            boatName: res.boatName,
            startDate: new Date(res.startDate),
            endDate: new Date(res.endDate)
        }));
        
        // Importer les réservations
        await Reservation.insertMany(formattedReservations);
        
        // Réactiver la validation
        reservationSchema.path('startDate').validators.push(originalValidate);
        
        console.log('✅ Réservations importées');

        console.log('✅ Import terminé avec succès');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de l\'import:', error);
        process.exit(1);
    }
}

importData(); 