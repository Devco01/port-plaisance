var mongoose = require('mongoose');
var MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

var mongod = null;

var connect = function() {
    return MongoMemoryServer.create()
        .then(function(server) {
            mongod = server;
            var mongoUri = mongod.getUri();
            return mongoose.connect(mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        });
};

var closeDatabase = function() {
    return mongoose.connection.dropDatabase()
        .then(function() {
            return mongoose.connection.close();
        })
        .then(function() {
            if (mongod) {
                return mongod.stop();
            }
        });
};

var clearDatabase = function() {
    var collections = mongoose.connection.collections;
    return Promise.all(
        Object.values(collections).map(function(collection) {
            return collection.deleteMany();
        })
    );
};

module.exports = {
    connect: connect,
    closeDatabase: closeDatabase,
    clearDatabase: clearDatabase
}; 