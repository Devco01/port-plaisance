var mongoose = require('mongoose');
var config = require('./config');

module.exports = {
    connect: function() {
        return mongoose.connect(config.db.uri, config.db.options)
            .then(function() {
                console.log('✅ Connecté à MongoDB:', config.db.uri);
            })
            .catch(function(error) {
                console.error('❌ Erreur de connexion à MongoDB:', error);
                throw error;
            });
    },

    close: function() {
        return mongoose.connection.close()
            .then(function() {
                console.log('✅ Déconnecté de MongoDB');
            })
            .catch(function(error) {
                console.error('❌ Erreur lors de la déconnexion:', error);
                throw error;
            });
    }
};
