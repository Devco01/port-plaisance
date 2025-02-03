require('dotenv').config();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var Catway = require('../models/catway');
var Reservation = require('../models/reservation');

var initDb = function() {
    var mongoURI = process.env.MONGODB_URL || process.env.MONGODB_URI;
    console.log('🔄 Initialisation de la base de données...');

    return mongoose.connect(mongoURI)
        .then(function() {
            console.log('✅ Connecté à MongoDB');
            return Promise.all([
                User.deleteMany({}),
                Catway.deleteMany({}),
                Reservation.deleteMany({})
            ]);
        })
        .then(function() {
            console.log('✅ Collections nettoyées');

            // Créer les catways par défaut
            var catways = [];
            for (var i = 1; i <= 20; i++) {
                catways.push({
                    catwayNumber: 'C' + i.toString().padStart(2, '0'),
                    catwayType: i <= 10 ? 'long' : 'short',
                    catwayState: 'disponible'
                });
            }
            return Catway.insertMany(catways);
        })
        .then(function(result) {
            console.log('✅ Catways créés:', result.length);
            return User.create({
                email: 'admin@portplaisance.fr',
                password: process.env.ADMIN_PASSWORD || 'Admin123!',
                role: 'admin',
                nom: 'Admin',
                prenom: 'Port Russell'
            });
        })
        .then(function() {
            console.log('✅ Utilisateur admin créé');
            console.log('✅ Initialisation terminée');
        })
        .catch(function(error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            throw error;
        })
        .finally(function() {
            mongoose.disconnect();
        });
};

// Exécuter l'initialisation si le script est appelé directement
if (require.main === module) {
    initDb();
}

module.exports = initDb; 