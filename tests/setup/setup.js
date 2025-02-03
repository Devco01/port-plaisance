const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

module.exports = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Configuration globale pour les tests
    global.__MONGO_URI__ = mongoUri;
    global.__MONGO_SERVER__ = mongoServer;

    // Helpers pour les tests
    global.createTestUser = async (User, userData = {}) => {
        const defaultUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'Test123!',
            role: 'user',
            active: true
        };

        return await new User({
            ...defaultUser,
            ...userData
        }).save();
    };

    global.createTestCatway = async (Catway, catwayData = {}) => {
        const defaultCatway = {
            catwayNumber: 'A1',
            catwayType: 'long',
            catwayState: 'disponible'
        };

        return await new Catway({
            ...defaultCatway,
            ...catwayData
        }).save();
    };

    global.createTestReservation = async (Reservation, reservationData = {}) => {
        const defaultReservation = {
            catwayNumber: 'A1',
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            boatLength: 15,
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-06-07')
        };

        return await new Reservation({
            ...defaultReservation,
            ...reservationData
        }).save();
    };
}; 