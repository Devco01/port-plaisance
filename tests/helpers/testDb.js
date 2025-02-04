var mongoose = require('mongoose');
var MongoMemoryServer = require('mongodb-memory-server-core').MongoMemoryServer;

var mongod = null;
var connection = null;

module.exports = {
    connect: function() {
        if (connection) {
            return Promise.resolve(connection);
        }

        return MongoMemoryServer.create()
            .then(function(server) {
                mongod = server;
                return mongod.getUri();
            })
            .then(function(uri) {
                // Fermer toute connexion existante
                if (mongoose.connection.readyState !== 0) {
                    return mongoose.connection.close()
                        .then(function() {
                            return mongoose.connect(uri, {
                                useNewUrlParser: true,
                                useUnifiedTopology: true
                            });
                        });
                }
                return mongoose.connect(uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
            })
            .then(function(conn) {
                connection = conn;
                return connection;
            });
    },

    disconnect: function() {
        return mongoose.connection.close()
            .then(function() {
                if (mongod) {
                    return mongod.stop();
                }
            })
            .then(function() {
                connection = null;
                mongod = null;
            });
    },

    clearDatabase: function() {
        if (!mongoose.connection.db) {
            return Promise.reject(new Error('Not connected to database'));
        }
        
        var collections = mongoose.connection.collections;
        var promises = [];
        
        for (var key in collections) {
            if (collections.hasOwnProperty(key)) {
                promises.push(collections[key].deleteMany({}));
            }
        }
        
        return Promise.all(promises);
    }
};

// Gestion propre de la fermeture
process.on('SIGTERM', function() {
    if (mongoose.connection.db) {
        mongoose.connection.close(function() {
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});