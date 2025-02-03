const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/app');
const User = require('../../server/models/User');
const bcrypt = require('bcrypt');

describe('Auth Routes', () => {
    const testUser = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'Test123!',
        nom: 'Test',
        prenom: 'User',
        role: 'user'
    };

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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testUser.password, salt);
        await User.create({ ...testUser, password: hashedPassword });
    });

    describe('POST /login', () => {
        test('devrait authentifier un utilisateur avec des identifiants valides', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.status).toBe(200);
            expect(res.body.user).toBeDefined();
            expect(res.body.user.email).toBe(testUser.email);
            expect(res.body.user.password).toBeUndefined();
            expect(res.headers['set-cookie']).toBeDefined();
        });

        test('devrait rejeter un email incorrect', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    email: 'wrong@test.com',
                    password: testUser.password
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toContain('incorrect');
        });

        test('devrait rejeter un mot de passe incorrect', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    email: testUser.email,
                    password: 'WrongPass123!'
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toContain('incorrect');
        });
    });

    describe('GET /logout', () => {
        let token;

        beforeEach(async () => {
            const loginRes = await request(app)
                .post('/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });
            token = loginRes.headers['set-cookie'][0];
        });

        test('devrait déconnecter un utilisateur authentifié', async () => {
            const res = await request(app)
                .get('/logout')
                .set('Cookie', [token]);

            expect(res.status).toBe(200);
            expect(res.body.message).toContain('Déconnexion réussie');
            expect(res.headers['set-cookie'][0]).toMatch(/token=;/);
        });

        test('devrait rejeter une déconnexion sans authentification', async () => {
            const res = await request(app).get('/logout');
            expect(res.status).toBe(401);
        });
    });

    describe('GET /me', () => {
        let token;

        beforeEach(async () => {
            const loginRes = await request(app)
                .post('/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });
            token = loginRes.headers['set-cookie'][0];
        });

        test('devrait retourner les informations de l\'utilisateur connecté', async () => {
            const res = await request(app)
                .get('/me')
                .set('Cookie', [token]);

            expect(res.status).toBe(200);
            expect(res.body.email).toBe(testUser.email);
            expect(res.body.password).toBeUndefined();
        });

        test('devrait rejeter une requête sans authentification', async () => {
            const res = await request(app).get('/me');
            expect(res.status).toBe(401);
        });
    });

    describe('POST /change-password', () => {
        let token;
        const newPassword = 'NewPass123!';

        beforeEach(async () => {
            const loginRes = await request(app)
                .post('/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });
            token = loginRes.headers['set-cookie'][0];
        });

        test('devrait changer le mot de passe avec des données valides', async () => {
            const res = await request(app)
                .post('/change-password')
                .set('Cookie', [token])
                .send({
                    currentPassword: testUser.password,
                    newPassword: newPassword
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toContain('succès');

            // Vérifier que le nouveau mot de passe fonctionne
            const loginRes = await request(app)
                .post('/login')
                .send({
                    email: testUser.email,
                    password: newPassword
                });
            expect(loginRes.status).toBe(200);
        });

        test('devrait rejeter un mot de passe actuel incorrect', async () => {
            const res = await request(app)
                .post('/change-password')
                .set('Cookie', [token])
                .send({
                    currentPassword: 'WrongPass123!',
                    newPassword: newPassword
                });

            expect(res.status).toBe(401);
        });

        test('devrait rejeter un nouveau mot de passe invalide', async () => {
            const res = await request(app)
                .post('/change-password')
                .set('Cookie', [token])
                .send({
                    currentPassword: testUser.password,
                    newPassword: 'weak'
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('mot de passe');
        });
    });
}); 