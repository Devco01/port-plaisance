var request = require('supertest');
var mongoose = require('mongoose');
var app = require('../../server/app');
var User = require('../../server/models/user');
var bcrypt = require('bcrypt');

describe('Auth Routes', function() {
    var testUser = {
        email: 'test@test.com',
        password: 'Test123!',
        nom: 'Test',
        prenom: 'User',
        role: 'user'
    };

    beforeAll(function(done) {
        mongoose.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(function() { done(); });
    });

    afterAll(function(done) {
        mongoose.connection.close()
            .then(function() { done(); });
    });

    beforeEach(function(done) {
        User.deleteMany({})
            .then(function() {
                return bcrypt.genSalt(10);
            })
            .then(function(salt) {
                return bcrypt.hash(testUser.password, salt);
            })
            .then(function(hashedPassword) {
                var userData = Object.assign({}, testUser, { password: hashedPassword });
                return User.create(userData);
            })
            .then(function() { done(); });
    });

    describe('POST /api/auth/login', function() {
        it('devrait authentifier un utilisateur avec des identifiants valides', function(done) {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.token).toBeDefined();
                    expect(res.body.user.email).toBe(testUser.email);
                    expect(res.body.user.password).toBeUndefined();
                    done();
                });
        });

        it('devrait rejeter un email incorrect', function(done) {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrong@test.com',
                    password: testUser.password
                })
                .expect(401)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.message).toContain('incorrect');
                    done();
                });
        });

        it('devrait rejeter un mot de passe incorrect', function(done) {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'WrongPass123!'
                })
                .expect(401)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.message).toContain('incorrect');
                    done();
                });
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