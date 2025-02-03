const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

module.exports = {
    connect: async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
    },

    closeDatabase: async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        if (mongod) {
            await mongod.stop();
            mongod = null;
        }
    },

    clearDatabase: async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
}; 