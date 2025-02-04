var mongoose = require('mongoose');
var MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

var mongod;

module.exports = function() {
    return MongoMemoryServer.create()
        .then(function(server) {
            mongod = server;
            var uri = mongod.getUri();
            global.__MONGO_URI__ = uri;
            
            return mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        })
        .then(function() {
            // Nettoyer les collections avant chaque test
            var collections = mongoose.connection.collections;
            return Promise.all(
                Object.keys(collections).map(function(key) {
                    return collections[key].deleteMany();
                })
            );
        });
};

// Nettoyage après tous les tests
module.exports.teardown = function() {
    return mongoose.disconnect()
        .then(function() {
            if (mongod) {
                return mongod.stop();
            }
        });
}; 