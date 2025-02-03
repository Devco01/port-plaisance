const mongoose = require('mongoose');
const User = require('../models/User');

describe('User Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should validate a valid user', async () => {
        const validUser = {
            email: 'test@test.com',
            password: 'password123',
            nom: 'Doe',
            prenom: 'John'
        };
        const user = new User(validUser);
        const saved = await user.save();
        expect(saved._id).toBeDefined();
    });

    it('should fail validation for invalid email', async () => {
        const userWithInvalidEmail = {
            email: 'invalid-email',
            password: 'password123',
            nom: 'Doe',
            prenom: 'John'
        };
        const user = new User(userWithInvalidEmail);
        await expect(user.save()).rejects.toThrow();
    });

    it('should fail validation for short password', async () => {
        const userWithShortPassword = {
            email: 'test@test.com',
            password: '123',
            nom: 'Doe',
            prenom: 'John'
        };
        const user = new User(userWithShortPassword);
        await expect(user.save()).rejects.toThrow();
    });
}); 