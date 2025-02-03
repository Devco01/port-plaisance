const mongoose = require('mongoose');
const User = require('../../server/models/User');
const bcrypt = require('bcrypt');

describe('User Model', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    const validUser = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'Test123!',
        nom: 'Test',
        prenom: 'User',
        role: 'user'
    };

    describe('Validation', () => {
        test('devrait créer un utilisateur valide', async () => {
            const user = new User(validUser);
            const savedUser = await user.save();
            
            expect(savedUser._id).toBeDefined();
            expect(savedUser.email).toBe(validUser.email);
            expect(savedUser.password).not.toBe(validUser.password);
        });

        test('devrait hasher le mot de passe avant la sauvegarde', async () => {
            const user = new User(validUser);
            await user.save();

            const isMatch = await bcrypt.compare(validUser.password, user.password);
            expect(isMatch).toBe(true);
        });

        test('devrait rejeter un email invalide', async () => {
            const user = new User({
                ...validUser,
                email: 'invalid-email'
            });

            await expect(user.save()).rejects.toThrow();
        });

        test('devrait rejeter un email en double', async () => {
            await new User(validUser).save();
            const duplicateUser = new User(validUser);

            await expect(duplicateUser.save()).rejects.toThrow();
        });

        test('devrait rejeter un mot de passe trop court', async () => {
            const user = new User({
                ...validUser,
                password: 'short'
            });

            await expect(user.save()).rejects.toThrow();
        });

        test('devrait rejeter un rôle invalide', async () => {
            const user = new User({
                ...validUser,
                role: 'invalid'
            });

            await expect(user.save()).rejects.toThrow();
        });
    });

    describe('Méthodes', () => {
        test('comparePassword devrait retourner true pour un mot de passe correct', async () => {
            const user = new User(validUser);
            await user.save();

            const isMatch = await user.comparePassword(validUser.password);
            expect(isMatch).toBe(true);
        });

        test('comparePassword devrait retourner false pour un mot de passe incorrect', async () => {
            const user = new User(validUser);
            await user.save();

            const isMatch = await user.comparePassword('wrongpassword');
            expect(isMatch).toBe(false);
        });

        test('toJSON ne devrait pas inclure le mot de passe', async () => {
            const user = new User(validUser);
            await user.save();

            const userJSON = user.toJSON();
            expect(userJSON.password).toBeUndefined();
        });
    });

    describe('Hooks', () => {
        test('devrait mettre à jour updatedAt lors de la modification', async () => {
            const user = await new User(validUser).save();
            const originalUpdatedAt = user.updatedAt;

            // Attendre un moment pour s'assurer que updatedAt change
            await new Promise(resolve => setTimeout(resolve, 100));

            user.nom = 'Updated';
            await user.save();

            expect(user.updatedAt).not.toEqual(originalUpdatedAt);
        });

        test('devrait hasher le mot de passe lors de sa modification', async () => {
            const user = await new User(validUser).save();
            const originalPassword = user.password;

            user.password = 'NewPass123!';
            await user.save();

            expect(user.password).not.toEqual(originalPassword);
            const isMatch = await bcrypt.compare('NewPass123!', user.password);
            expect(isMatch).toBe(true);
        });
    });
}); 