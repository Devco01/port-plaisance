const mongoose = require('mongoose');
<<<<<<< HEAD
const Catway = require('../../server/models/catway');

describe('Catway Model', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
=======
const Catway = require('../models/catway');

describe('Catway Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__);
>>>>>>> 9e1db78a25cb06c03b52345848bd5bfc84fe2764
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

<<<<<<< HEAD
    beforeEach(async () => {
        await Catway.deleteMany({});
    });

    const validCatway = {
        catwayNumber: 'A1',
        catwayType: 'long',
        catwayState: 'disponible'
    };

    describe('Validation', () => {
        test('devrait créer un catway valide', async () => {
            const catway = new Catway(validCatway);
            const savedCatway = await catway.save();
            
            expect(savedCatway._id).toBeDefined();
            expect(savedCatway.catwayNumber).toBe(validCatway.catwayNumber);
            expect(savedCatway.catwayType).toBe(validCatway.catwayType);
        });

        test('devrait rejeter un numéro de catway en double', async () => {
            await new Catway(validCatway).save();
            const duplicateCatway = new Catway(validCatway);

            await expect(duplicateCatway.save()).rejects.toThrow();
        });

        test('devrait rejeter un type de catway invalide', async () => {
            const catway = new Catway({
                ...validCatway,
                catwayType: 'invalid'
            });

            await expect(catway.save()).rejects.toThrow();
        });

        test('devrait rejeter un catway sans numéro', async () => {
            const catway = new Catway({
                catwayType: 'long',
                catwayState: 'disponible'
            });

            await expect(catway.save()).rejects.toThrow();
        });

        test('devrait accepter les deux types valides', async () => {
            const longCatway = new Catway({
                ...validCatway,
                catwayType: 'long'
            });
            const shortCatway = new Catway({
                ...validCatway,
                catwayNumber: 'A2',
                catwayType: 'short'
            });

            await expect(longCatway.save()).resolves.toBeDefined();
            await expect(shortCatway.save()).resolves.toBeDefined();
        });
    });

    describe('Méthodes', () => {
        test('toJSON devrait inclure tous les champs nécessaires', async () => {
            const catway = await new Catway(validCatway).save();
            const catwayJSON = catway.toJSON();

            expect(catwayJSON.catwayNumber).toBe(validCatway.catwayNumber);
            expect(catwayJSON.catwayType).toBe(validCatway.catwayType);
            expect(catwayJSON.catwayState).toBe(validCatway.catwayState);
        });
    });

    describe('Hooks', () => {
        test('devrait mettre à jour updatedAt lors de la modification', async () => {
            const catway = await new Catway(validCatway).save();
            const originalUpdatedAt = catway.updatedAt;

            await new Promise(resolve => setTimeout(resolve, 100));

            catway.catwayState = 'maintenance';
            await catway.save();

            expect(catway.updatedAt).not.toEqual(originalUpdatedAt);
        });

        test('ne devrait pas permettre de modifier le numéro', async () => {
            const catway = await new Catway(validCatway).save();
            catway.catwayNumber = 'B1';

            await expect(catway.save()).rejects.toThrow();
        });

        test('ne devrait pas permettre de modifier le type', async () => {
            const catway = await new Catway(validCatway).save();
            catway.catwayType = 'short';

            await expect(catway.save()).rejects.toThrow();
        });
=======
    it('should validate a valid catway', async () => {
        const validCatway = {
            catwayNumber: '123',
            catwayType: 'long',
            catwayState: 'disponible'
        };
        const catway = new Catway(validCatway);
        const saved = await catway.save();
        expect(saved._id).toBeDefined();
    });

    it('should fail for duplicate catwayNumber', async () => {
        const catway1 = new Catway({
            catwayNumber: '123',
            catwayType: 'long',
            catwayState: 'disponible'
        });
        await catway1.save();

        const catway2 = new Catway({
            catwayNumber: '123',
            catwayType: 'short',
            catwayState: 'disponible'
        });
        await expect(catway2.save()).rejects.toThrow();
>>>>>>> 9e1db78a25cb06c03b52345848bd5bfc84fe2764
    });
}); 