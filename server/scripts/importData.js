const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
require('dotenv').config();

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Importer les catways
        const catwaysData = JSON.parse(
            await fs.readFile(path.join(__dirname, '../../data/catways.json'), 'utf-8')
        );
        await Catway.deleteMany({}); // Nettoyer la collection
        await Catway.insertMany(catwaysData);
        console.log('Catways importés avec succès');

        // Importer les réservations
        const reservationsData = JSON.parse(
            await fs.readFile(path.join(__dirname, '../../data/reservations.json'), 'utf-8')
        );
        await Reservation.deleteMany({}); // Nettoyer la collection
        await Reservation.insertMany(reservationsData);
        console.log('Réservations importées avec succès');

    } catch (error) {
        console.error('Erreur lors de l\'importation des données:', error);
    } finally {
        await mongoose.disconnect();
    }
};

importData(); 