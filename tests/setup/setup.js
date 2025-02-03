var mongoose = require('mongoose');
var MongoMemoryServer = require('mongodb-memory-server');


var mongoServer;

module.exports = function() {
    return MongoMemoryServer.create()
        .then(function(server) {
            mongoServer = server;
            var mongoUri = mongoServer.getUri();
            return mongoose.connect(mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        })
        .then(function() {
            // Configuration globale pour les tests
            global.__MONGO_URI__ = mongoServer.getUri();
            global.__MONGO_SERVER__ = mongoServer;

            // Helpers pour les tests
            global.createTestUser = function(User, userData) {
                userData = userData || {};
                var defaultUser = {
                    email: 'test@example.com',
                    password: 'Test123!',
                    role: 'user',
                    nom: 'Test',
                    prenom: 'User',
                    active: true
                };

                return new User(Object.assign({}, defaultUser, userData)).save();
            };

            global.createTestCatway = function(Catway, catwayData) {
                catwayData = catwayData || {};
                var defaultCatway = {
                    catwayNumber: 'A1',
                    catwayType: 'long',
                    catwayState: 'disponible'
                };

                return new Catway(Object.assign({}, defaultCatway, catwayData)).save();
            };

            global.createTestReservation = function(Reservation, reservationData) {
                reservationData = reservationData || {};
                var defaultReservation = {
                    catwayNumber: 'A1',
                    clientName: 'John Doe',
                    boatName: 'Sea Spirit',
                    startDate: new Date('2024-06-01'),
                    endDate: new Date('2024-06-07')
                };

                return new Reservation(Object.assign({}, defaultReservation, reservationData)).save();
            };
        });
}; 