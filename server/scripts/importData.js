require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const User = require('../models/user');

// Fonction pour connecter à MongoDB
const connectDB = async () => {
  try {
    console.log('Connexion à MongoDB...');
    console.log('URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Base de données:', mongoose.connection.db.databaseName);
    console.log('MongoDB connecté');
  } catch (err) {
    console.error('Erreur de connexion MongoDB:', err);
    process.exit(1);
  }
};

// Fonction pour importer les catways
const importCatways = async () => {
  try {
    console.log('Début de l\'import des catways...');
    const catwaysData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/catways.json'), 'utf-8')
    );

    // Vérifier que la collection existe
    const collections = await mongoose.connection.db.listCollections().toArray();
    const catwayCollection = collections.find(c => c.name === 'catways');
    
    if (catwayCollection) {
      console.log('Suppression de la collection catways...');
      await mongoose.connection.db.dropCollection('catways');
    }

    // Conversion des données au nouveau format
    const formattedCatways = catwaysData.map(catway => ({
      catwayNumber: catway.catwayNumber,
      catwayType: catway.catwayType || 'short',
      catwayState: catway.catwayState || 'bon état'
    }));

    console.log(`Tentative d'import de ${formattedCatways.length} catways...`);
    
    // Import des nouvelles données
    const result = await Catway.insertMany(formattedCatways);
    console.log(`✅ ${result.length} catways importés avec succès`);
    
    return result;
  } catch (err) {
    console.error('❌ Erreur lors de l\'import des catways:', err);
    throw err;
  }
};

// Fonction pour importer l'utilisateur admin
const importAdmin = async () => {
  await User.deleteMany({});
  const admin = await User.create({
    email: 'admin@portplaisance.fr',
    username: 'admin',
    password: 'PortAdmin2024!',
    role: 'admin'
  });
  return admin;
};

// Fonction pour importer les réservations
const importReservations = async (catways, admin) => {
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
        status: 'confirmed',
        user: admin._id
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
    console.log('=== DÉBUT IMPORT ===');
    console.log('URI MongoDB:', process.env.MONGODB_URI);
    await connectDB();
    console.log('Base de données:', mongoose.connection.db.databaseName);

    const admin = await importAdmin();
    console.log('Admin créé:', admin._id);

    const catways = await importCatways();
    console.log('Catways importés:', catways.length);

    await importReservations(catways, admin);
    console.log('=== FIN IMPORT ===');
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de l\'import:', err);
    process.exit(1);
  }
};

// Lancement de l'import
importAllData();