const request = require('supertest');
const app = require('../../server');
const User = require('../../server/models/user');
const Catway = require('../../server/models/catway');
const Reservation = require('../../server/models/reservation');
const jwt = require('jsonwebtoken');

describe('Frontend Routes', () => {
    let userToken, adminToken;
    
    beforeAll(async () => {
        await User.deleteMany({});
        await Catway.deleteMany({});
        await Reservation.deleteMany({});

        // Créer un utilisateur test
        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'Test123!',
            nom: 'Test',
            prenom: 'User',
            role: 'user'
        });

        // Créer un admin test
        const admin = await User.create({
            username: 'testadmin',
            email: 'admin@test.com',
            password: 'Admin123!',
            nom: 'Test',
            prenom: 'Admin',
            role: 'admin'
        });

        userToken = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET);
        adminToken = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
    });

    describe('Pages publiques', () => {
        test('GET / devrait afficher la page d\'accueil', async () => {
            const res = await request(app).get('/');
            expect(res.status).toBe(200);
        });

        test('GET /api-docs devrait afficher la documentation', async () => {
            const res = await request(app).get('/api-docs');
            expect(res.status).toBe(200);
        });
    });

    describe('Authentification', () => {
        test('POST /login avec identifiants valides devrait rediriger vers le dashboard', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    email: 'test@test.com',
                    password: 'Test123!'
                });
            expect(res.status).toBe(302);
            expect(res.headers.location).toBe('/dashboard');
            expect(res.headers['set-cookie']).toBeDefined();
        });

        test('POST /login avec identifiants invalides devrait afficher une erreur', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    email: 'test@test.com',
                    password: 'wrong'
                });
            expect(res.status).toBe(200);
            expect(res.text).toContain('Email ou mot de passe incorrect');
        });

        test('GET /logout devrait déconnecter l\'utilisateur', async () => {
            const res = await request(app)
                .get('/logout')
                .set('Cookie', [`token=${userToken}`]);
            expect(res.status).toBe(302);
            expect(res.headers.location).toBe('/');
            expect(res.headers['set-cookie'][0]).toContain('token=;');
        });
    });

    describe('Protection des routes', () => {
        test('GET /dashboard sans authentification devrait rediriger', async () => {
            const res = await request(app).get('/dashboard');
            expect(res.status).toBe(302);
            expect(res.headers.location).toBe('/');
        });

        test('GET /dashboard/users sans droits admin devrait afficher une erreur', async () => {
            const res = await request(app)
                .get('/dashboard/users')
                .set('Cookie', [`token=${userToken}`]);
            expect(res.status).toBe(200);
            expect(res.text).toContain('Accès non autorisé');
        });

        test('GET /dashboard/users avec droits admin devrait réussir', async () => {
            const res = await request(app)
                .get('/dashboard/users')
                .set('Cookie', [`token=${adminToken}`]);
            expect(res.status).toBe(200);
            expect(res.text).toContain('Gestion des utilisateurs');
        });
    });
}); 