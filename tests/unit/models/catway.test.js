const mongoose = require('mongoose');
const Catway = require('../../../server/models/catway');

describe('Catway Model Test', () => {
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
        await Catway.deleteMany({});
    });

    it('should create & save catway successfully', async () => {
        const validCatway = new Catway({
            catwayNumber: '1',
            catwayType: 'long',
            catwayState: 'disponible'
        });
        const savedCatway = await validCatway.save();
        
        expect(savedCatway._id).toBeDefined();
        expect(savedCatway.catwayNumber).toBe('1');
        expect(savedCatway.catwayType).toBe('long');
        expect(savedCatway.catwayState).toBe('disponible');
    });

    it('should fail to save catway without required fields', async () => {
        const catwayWithoutRequiredField = new Catway({ catwayNumber: '1' });
        let err;
        
        try {
            await catwayWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should fail to save duplicate catway number', async () => {
        const firstCatway = new Catway({
            catwayNumber: '1',
            catwayType: 'long',
            catwayState: 'disponible'
        });
        await firstCatway.save();

        const duplicateCatway = new Catway({
            catwayNumber: '1',
            catwayType: 'short',
            catwayState: 'disponible'
        });

        let err;
        try {
            await duplicateCatway.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeDefined();
        expect(err.code).toBe(11000); // Code MongoDB pour violation d'unicité
    });

    it('should only accept valid catway types', async () => {
        const invalidCatway = new Catway({
            catwayNumber: '1',
            catwayType: 'invalid',
            catwayState: 'disponible'
        });

        let err;
        try {
            await invalidCatway.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeDefined();
        expect(err.errors.catwayType).toBeDefined();
    });
}); 