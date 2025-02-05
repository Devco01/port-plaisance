var MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;

module.exports = function () {
    return MongoMemoryServer.create().then(function (mongoServer) {
        process.env.MONGO_URI = mongoServer.getUri();
        global.__MONGO_SERVER__ = mongoServer;
        return mongoServer;
    });
};
