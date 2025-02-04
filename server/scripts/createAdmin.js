var mongoose = require('mongoose');
var User = require('../models/user');
require('dotenv').config();

var createAdminUser = function () {
    mongoose
        .connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(function () {
            return User.findOne({ role: 'admin' });
        })
        .then(function (adminExists) {
            if (adminExists) {
                console.log('Un administrateur existe déjà');
                process.exit(0);
            }

            var admin = new User({
                username: 'admin',
                email: 'admin@port-russell.com',
                password: process.env.ADMIN_PASSWORD || 'Admin123!',
                role: 'admin',
                nom: 'Admin',
                prenom: 'Port Russell'
            });

            return admin.save();
        })
        .then(function (admin) {
            console.log('Administrateur créé avec succès');
            console.log('Email:', admin.email);
            console.log(
                'Mot de passe:',
                process.env.ADMIN_PASSWORD || 'Admin123!'
            );
        })
        .catch(function (error) {
            console.error(
                'Erreur lors de la création de l\'administrateur:',
                error
            );
        })
        .finally(function () {
            mongoose.disconnect();
        });
};

createAdminUser();
