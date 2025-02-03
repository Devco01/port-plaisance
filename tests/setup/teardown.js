const mongoose = require('mongoose');

module.exports = async () => {
    // Nettoyage de la base de données
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await global.__MONGO_SERVER__.stop();

    // Nettoyage des variables globales
    delete global.__MONGO_URI__;
    delete global.__MONGO_SERVER__;
    delete global.createTestUser;
    delete global.createTestCatway;
    delete global.createTestReservation;
}; 