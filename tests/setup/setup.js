var mongoose = require('mongoose');
var MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

var setup = function() {
    return new Promise(function(resolve) {
        MongoMemoryServer.create()
            .then(function(mongoServer) {
                var mongoUri = mongoServer.getUri();
                global.__MONGO_URI__ = mongoUri;
                global.__MONGO_SERVER__ = mongoServer;
                return mongoose.connect(mongoUri);
            })
            .then(function() {
                // Helpers pour les tests
                global.createTestUser = function(userData) {
                    var defaultUser = {
                        email: 'test@example.com',
                        password: 'Test123!',
                        role: 'user',
                        nom: 'Test',
                        prenom: 'User'
                    };
                    return Object.assign({}, defaultUser, userData || {});
                };

                global.createTestCatway = function(catwayData) {
                    var defaultCatway = {
                        catwayNumber: 'A1',
                        catwayType: 'long',
                        catwayState: 'disponible'
                    };
                    return Object.assign({}, defaultCatway, catwayData || {});
                };

                global.createTestReservation = function(reservationData) {
                    var defaultReservation = {
                        catwayNumber: 'A1',
                        clientName: 'Jean Dupont',
                        boatName: 'Le Petit Navire',
                        startDate: new Date('2024-06-01'),
                        endDate: new Date('2024-06-07')
                    };
                    return Object.assign({}, defaultReservation, reservationData || {});
                };
                resolve();
            });
    });
};

module.exports = setup; 