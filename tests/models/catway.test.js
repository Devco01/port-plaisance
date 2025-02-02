const mongoose = require('mongoose');
const Catway = require('../models/catway');

describe('Catway Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

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
    });
}); 