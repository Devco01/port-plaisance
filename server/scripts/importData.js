require('dotenv').config();
console.log('ImportData - URL MongoDB:', process.env.MONGODB_URL);
var mongoose = require('mongoose');
var Catway = require('../models/catway');
var User = require('../models/user');
var fs = require('fs').promises;
var path = require('path');
var bcrypt = require('bcrypt');
var Reservation = require('../models/reservation');

var importData = function() {
    var mongoURI = process.env.MONGODB_URL || process.env.MONGODB_URI;
    
    return mongoose.connect(mongoURI)
        .then(function() {
            console.log('✅ Connecté à MongoDB');
            return fs.readFile(path.join(__dirname, '../data/catways.json'), 'utf8');
        })
        .then(function(data) {
            var catways = JSON.parse(data);
            return Catway.insertMany(catways);
        })
        .then(function(result) {
            console.log('✅ Catways importés:', result.length);
            return fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8');
        })
        .then(function(data) {
            var users = JSON.parse(data);
            var hashedUsers = users.map(function(user) {
                user.password = bcrypt.hashSync(user.password, 10);
                return user;
            });
            return User.insertMany(hashedUsers);
        })
        .then(function(result) {
            console.log('✅ Utilisateurs importés:', result.length);
            return fs.readFile(path.join(__dirname, '../data/reservations.json'), 'utf8');
        })
        .then(function(data) {
            var reservations = JSON.parse(data);
            return Reservation.insertMany(reservations);
        })
        .then(function(result) {
            console.log('✅ Réservations importées:', result.length);
            console.log('✅ Import terminé avec succès');
        })
        .catch(function(error) {
            console.error('❌ Erreur lors de l\'import:', error);
            throw error;
        })
        .finally(function() {
            mongoose.disconnect();
        });
};

// Exécuter l'import si le script est appelé directement
if (require.main === module) {
    importData();
}

module.exports = importData; 