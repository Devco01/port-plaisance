const mongoose = require('mongoose');
const Reservation = require('../../../server/models/reservation');
const User = require('../../../server/models/user');
const Catway = require('../../../server/models/catway');

describe('Reservation Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Reservation.deleteMany({});
        await User.deleteMany({});
        await Catway.deleteMany({});
    });

    it('should create & save reservation successfully', async () => {
        const user = await User.create({
            email: 'test@test.com',
            password: 'password123',
            nom: 'Test',
            prenom: 'User'
        });

        const catway = await Catway.create({
            catwayNumber: '1',
            catwayType: 'long',
            catwayState: 'disponible'
        });

        const validReservation = new Reservation({
            user: user._id,
            catway: catway._id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000)
        });

        const savedReservation = await validReservation.save();
        
        expect(savedReservation._id).toBeDefined();
        expect(savedReservation.user.toString()).toBe(user._id.toString());
        expect(savedReservation.catway.toString()).toBe(catway._id.toString());
    });

    it('should fail to save reservation without required fields', async () => {
        const reservationWithoutRequiredField = new Reservation({
            startDate: new Date()
        });

        let err;
        try {
            await reservationWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should fail to save reservation with end date before start date', async () => {
        const user = await User.create({
            email: 'test@test.com',
            password: 'password123',
            nom: 'Test',
            prenom: 'User'
        });

        const catway = await Catway.create({
            catwayNumber: '1',
            catwayType: 'long',
            catwayState: 'disponible'
        });

        const invalidReservation = new Reservation({
            user: user._id,
            catway: catway._id,
            startDate: new Date(Date.now() + 86400000),
            endDate: new Date()
        });

        let err;
        try {
            await invalidReservation.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeDefined();
    });
}); 