const mongoose = require('mongoose');
const Reservation = require('../../server/models/reservation');
const Catway = require('../../server/models/catway');

describe('Reservation Model Test', () => {
    let testCatway;

    beforeEach(async () => {
        // Nettoyer avant chaque test
        await Catway.deleteMany();
        await Reservation.deleteMany();

        // Créer un catway pour chaque test
        testCatway = await Catway.create({
            catwayNumber: 1,
            catwayType: 'court',
            catwayState: 'disponible'
        });
    });

    afterAll(async () => {
        // Nettoyer tout à la fin
        await Catway.deleteMany();
        await Reservation.deleteMany();
    });

    it('devrait valider une réservation valide', async () => {
        const validReservation = await Reservation.create({
            catwayNumber: testCatway.catwayNumber,
            clientName: 'Jean Dupont',
            boatName: 'Le Petit Mousse',
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-03-15')
        });
        expect(validReservation._id).toBeDefined();
    });

    it('devrait rejeter une réservation sans nom de client', async () => {
        const invalidReservation = new Reservation({
            catwayNumber: testCatway.catwayNumber,
            boatName: 'Le Petit Mousse',
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-03-15')
        });
        await expect(invalidReservation.save()).rejects.toThrow();
    });

    it('devrait rejeter une date de fin antérieure à la date de début', async () => {
        const invalidReservation = new Reservation({
            catwayNumber: testCatway.catwayNumber,
            clientName: 'Jean Dupont',
            boatName: 'Le Petit Mousse',
            startDate: new Date('2024-03-15'),
            endDate: new Date('2024-03-01')
        });
        await expect(invalidReservation.save()).rejects.toThrow();
    });

    it('devrait rejeter les réservations qui se chevauchent', async () => {
        // Première réservation
        await Reservation.create({
            catwayNumber: testCatway.catwayNumber,
            clientName: 'Jean Dupont',
            boatName: 'Le Petit Mousse',
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-03-15')
        });

        // Deuxième réservation qui chevauche
        const overlappingReservation = new Reservation({
            catwayNumber: testCatway.catwayNumber,
            clientName: 'Marie Martin',
            boatName: 'Belle Mer',
            startDate: new Date('2024-03-10'),
            endDate: new Date('2024-03-20')
        });

        await expect(overlappingReservation.save()).rejects.toThrow();
    });
}); 