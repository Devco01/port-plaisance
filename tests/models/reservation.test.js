const mongoose = require('mongoose');
<<<<<<< HEAD
const Reservation = require('../../server/models/reservation');
const Catway = require('../../server/models/catway');

describe('Reservation Model', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
=======
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
>>>>>>> 9e1db78a25cb06c03b52345848bd5bfc84fe2764
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

<<<<<<< HEAD
    beforeEach(async () => {
        await Reservation.deleteMany({});
        await Catway.deleteMany({});
    });

    const validCatway = {
        catwayNumber: 'A1',
        catwayType: 'long',
        catwayState: 'disponible'
    };

    const validReservation = {
        catwayNumber: 'A1',
        clientName: 'John Doe',
        boatName: 'Sea Spirit',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-07')
    };

    describe('Validation', () => {
        beforeEach(async () => {
            await new Catway(validCatway).save();
        });

        test('devrait créer une réservation valide', async () => {
            const reservation = new Reservation(validReservation);
            const savedReservation = await reservation.save();
            
            expect(savedReservation._id).toBeDefined();
            expect(savedReservation.catwayNumber).toBe(validReservation.catwayNumber);
            expect(savedReservation.clientName).toBe(validReservation.clientName);
        });

        test('devrait rejeter une réservation sans catway', async () => {
            const reservation = new Reservation({
                ...validReservation,
                catwayNumber: 'INVALID'
            });

            await expect(reservation.save()).rejects.toThrow();
        });

        test('devrait rejeter une réservation avec des dates invalides', async () => {
            const reservation = new Reservation({
                ...validReservation,
                startDate: new Date('2024-06-07'),
                endDate: new Date('2024-06-01')
            });

            await expect(reservation.save()).rejects.toThrow();
        });

        test('devrait rejeter une réservation qui chevauche une existante', async () => {
            await new Reservation(validReservation).save();

            const overlappingReservation = new Reservation({
                ...validReservation,
                startDate: new Date('2024-06-05'),
                endDate: new Date('2024-06-10')
            });

            await expect(overlappingReservation.save()).rejects.toThrow();
        });

        test('devrait rejeter une réservation sans nom de client', async () => {
            const reservation = new Reservation({
                ...validReservation,
                clientName: ''
            });

            await expect(reservation.save()).rejects.toThrow();
        });

        test('devrait rejeter une réservation sans nom de bateau', async () => {
            const reservation = new Reservation({
                ...validReservation,
                boatName: ''
            });

            await expect(reservation.save()).rejects.toThrow();
        });
    });

    describe('Méthodes', () => {
        test('toJSON devrait inclure tous les champs nécessaires', async () => {
            const reservation = await new Reservation(validReservation).save();
            const reservationJSON = reservation.toJSON();

            expect(reservationJSON.catwayNumber).toBe(validReservation.catwayNumber);
            expect(reservationJSON.clientName).toBe(validReservation.clientName);
            expect(reservationJSON.boatName).toBe(validReservation.boatName);
            expect(new Date(reservationJSON.startDate)).toEqual(validReservation.startDate);
            expect(new Date(reservationJSON.endDate)).toEqual(validReservation.endDate);
        });

        test('isActive devrait retourner true pour une réservation en cours', async () => {
            const now = new Date();
            const reservation = new Reservation({
                ...validReservation,
                startDate: new Date(now.setDate(now.getDate() - 1)),
                endDate: new Date(now.setDate(now.getDate() + 2))
            });

            expect(reservation.isActive()).toBe(true);
        });

        test('isActive devrait retourner false pour une réservation passée', async () => {
            const now = new Date();
            const reservation = new Reservation({
                ...validReservation,
                startDate: new Date(now.setDate(now.getDate() - 10)),
                endDate: new Date(now.setDate(now.getDate() - 5))
            });

            expect(reservation.isActive()).toBe(false);
        });
    });

    describe('Hooks', () => {
        test('devrait mettre à jour updatedAt lors de la modification', async () => {
            const reservation = await new Reservation(validReservation).save();
            const originalUpdatedAt = reservation.updatedAt;

            await new Promise(resolve => setTimeout(resolve, 100));

            reservation.clientName = 'Jane Doe';
            await reservation.save();

            expect(reservation.updatedAt).not.toEqual(originalUpdatedAt);
        });
=======
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
>>>>>>> 9e1db78a25cb06c03b52345848bd5bfc84fe2764
    });
}); 