require('dotenv').config();
console.log('CheckAdmin - URL MongoDB:', process.env.MONGODB_URI);
var mongoose = require('mongoose');
var User = require('../models/user');
var bcrypt = require('bcrypt');

var checkAndCreateAdmin = function() {
    console.log('🔄 Vérification du compte admin...');

    return User.findOne({ role: 'admin' })
        .then(function(admin) {
            if (!admin) {
                console.log('➕ Création du compte admin...');
                var admin = new User({
                    email: 'admin@portplaisance.fr',
                    password: process.env.ADMIN_PASSWORD || 'Admin123!',
                    role: 'admin',
                    nom: 'Admin',
                    prenom: 'Port Russell'
                });
                return admin.save();
            }
            return admin;
        })
        .then(function(admin) {
            console.log('✅ Compte admin vérifié');
            return admin;
        })
        .catch(function(error) {
            console.error('❌ Erreur lors de la vérification/création du compte admin:', error);
            throw error;
        });
};

module.exports = {
    checkAndCreateAdmin: checkAndCreateAdmin
}; 