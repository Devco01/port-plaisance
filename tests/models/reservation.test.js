const mongoose = require('mongoose');
const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

describe('Reservation Model Test', () => {
    let catwayId;

    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__);
        const catway = await new Catway({
            catwayNumber: '123',
            catwayType: 'long',
            catwayState: 'disponible'
        }).save();
        catwayId = catway._id;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should validate a valid reservation', async () => {
        const validReservation = {
            catwayId,
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            startDate: new Date(Date.now() + 86400000), // demain
            endDate: new Date(Date.now() + 172800000)   // après-demain
        };
        const reservation = new Reservation(validReservation);
        const saved = await reservation.save();
        expect(saved._id).toBeDefined();
    });

    it('should fail for overlapping dates', async () => {
        const reservation1 = await new Reservation({
            catwayId,
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-03-05')
        }).save();

        const reservation2 = new Reservation({
            catwayId,
            clientName: 'Jane Doe',
            boatName: 'Ocean Dream',
            startDate: new Date('2024-03-03'),
            endDate: new Date('2024-03-07')
        });

        await expect(reservation2.save()).rejects.toThrow();
    });
}); 