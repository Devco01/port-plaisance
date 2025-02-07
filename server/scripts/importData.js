require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');

// Fonction pour connecter à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connecté');
  } catch (err) {
    console.error('Erreur de connexion MongoDB:', err);
    process.exit(1);
  }
};

// Fonction pour importer les catways
const importCatways = async () => {
  try {
    const catwaysData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/catways.json'), 'utf-8')
    );

    console.log('=== Vérification des données catways ===');
    console.log('Nombre de catways dans le fichier JSON:', catwaysData.length);
    console.log('Premier catway dans le JSON:', catwaysData[0]);
    console.log('Dernier catway dans le JSON:', catwaysData[catwaysData.length - 1]);

    // Conversion des données au nouveau format
    const formattedCatways = catwaysData.map(catway => {
      if (!catway.catwayNumber) {
        console.error('Catway sans numéro:', catway);
        return null;
      }
      return {
        catwayNumber: catway.catwayNumber,
        catwayType: catway.catwayType || 'short',
        catwayState: catway.catwayState || 'bon état'
      };
    }).filter(Boolean);

    console.log('=== Données formatées ===');
    console.log('Nombre de catways après formatage:', formattedCatways.length);
    console.log('Données des catways à importer:', formattedCatways);

    // Suppression des données existantes
    const existingCount = await Catway.countDocuments();
    console.log('Nombre de catways existants avant suppression:', existingCount);
    await Catway.deleteMany({});
    
    // Import des nouvelles données
    const result = await Catway.insertMany(formattedCatways);
    console.log(`✅ ${result.length} catways importés sur ${catwaysData.length} attendus`);
    
    // Vérification finale
    const finalCount = await Catway.countDocuments();
    console.log('Nombre final de catways dans MongoDB:', finalCount);
    
    return result;
  } catch (err) {
    console.error('❌ Erreur lors de l\'import des catways:', err);
    console.error('Détails de l\'erreur:', err.stack);
    throw err;
  }
};

// Fonction pour importer les réservations
const importReservations = async (catways) => {
  try {
    const reservationsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/reservations.json'), 'utf-8')
    );

    console.log('=== Import des réservations ===');
    console.log('Données à importer:', reservationsData);

    // Création d'un Map pour la correspondance des numéros de catway
    const catwayMap = new Map(
      catways.map(catway => {
        console.log('Mapping catway:', catway.catwayNumber, '→', catway._id);
        return [catway.catwayNumber.toString(), catway._id];
      })
    );

    console.log('Map des catways:', Object.fromEntries(catwayMap));

    // Conversion et validation des données
    const formattedReservations = reservationsData
      .filter(reservation => {
        if (!reservation.catwayNumber || !reservation.clientName || !reservation.boatName) {
          console.log('Réservation invalide:', reservation);
          return false;
        }
        return true;
      })
      .map(reservation => ({
        catway: catwayMap.get(reservation.catwayNumber.toString()),
        catwayNumber: reservation.catwayNumber,
        clientName: reservation.clientName,
        boatName: reservation.boatName,
        startDate: new Date(reservation.startDate),
        endDate: new Date(reservation.endDate),
        status: 'confirmed'
      }))
      .filter(reservation => {
        if (!reservation.catway) {
          console.log('Réservation sans catway:', reservation);
          return false;
        }
        return true;
      });

    console.log('Réservations formatées:', formattedReservations);

    // Suppression des données existantes
    await Reservation.deleteMany({});
    
    // Import des nouvelles données
    const result = await Reservation.insertMany(formattedReservations);
    console.log(`✅ ${result.length} réservations importées:`, result);

    return result;
  } catch (err) {
    console.error('❌ Erreur lors de l\'import des réservations:', err);
    throw err;
  }
};

// Fonction principale
const importAllData = async () => {
  try {
    await connectDB();
    const catways = await importCatways();
    await importReservations(catways);
    console.log('Import terminé avec succès');
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de l\'import:', err);
    process.exit(1);
  }
};

// Lancement de l'import
importAllData();