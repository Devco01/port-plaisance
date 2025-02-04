var request = require('supertest');
var app = require('../../server/app');
var User = require('../../server/models/user');
var Catway = require('../../server/models/catway');
var Reservation = require('../../server/models/reservation');
var testDb = require('../helpers/testDb');
var auth = require('../helpers/auth');

describe('Tests API', function() {
    var userToken;
    var adminToken;
    var testCatway;
    var testReservation;

    beforeAll(function(done) {
        testDb.connect()
            .then(function() {
                return Promise.all([
                    User.create({
                        email: 'user@test.com',
                        password: 'Test123!',
                        role: 'user',
                        nom: 'Test',
                        prenom: 'User'
                    }),
                    User.create({
                        email: 'admin@test.com',
                        password: 'Admin123!',
                        role: 'admin',
                        nom: 'Admin',
                        prenom: 'Test'
                    }),
                    Catway.create({
                        catwayNumber: 'A1',
                        catwayType: 'long',
                        catwayState: 'disponible'
                    })
                ]);
            })
            .then(function(results) {
                userToken = auth.generateToken(results[0]);
                adminToken = auth.generateToken(results[1]);
                testCatway = results[2];
                done();
            });
    });

    afterAll(function(done) {
        testDb.closeDatabase()
            .then(function() { done(); });
    });

    describe('Routes Catways', function() {
        it('devrait lister tous les catways', function(done) {
            request(app)
                .get('/api/catways')
                .set('Authorization', 'Bearer ' + userToken)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(Array.isArray(res.body)).toBe(true);
                    done();
                });
        });

        it('devrait créer un nouveau catway en tant qu\'admin', function(done) {
            var newCatway = {
                catwayNumber: 'A2',
                catwayType: 'long',
                catwayState: 'disponible'
            };

            request(app)
                .post('/api/catways')
                .set('Authorization', 'Bearer ' + adminToken)
                .send(newCatway)
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.catwayNumber).toBe(newCatway.catwayNumber);
                    done();
                });
        });

        it('devrait mettre à jour l\'état d\'un catway', function(done) {
            var update = { catwayState: 'maintenance' };

            request(app)
                .put('/api/catways/' + testCatway.catwayNumber)
                .set('Authorization', 'Bearer ' + adminToken)
                .send(update)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.catwayState).toBe('maintenance');
                    done();
                });
        });

        it('devrait récupérer un catway spécifique', function(done) {
            request(app)
                .get('/api/catways/' + testCatway.catwayNumber)
                .set('Authorization', 'Bearer ' + userToken)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.catwayNumber).toBe(testCatway.catwayNumber);
                    done();
                });
        });

        it('devrait supprimer un catway', function(done) {
            request(app)
                .delete('/api/catways/' + testCatway.catwayNumber)
                .set('Authorization', 'Bearer ' + adminToken)
                .expect(200, done);
        });
    });

    describe('Routes Réservations', function() {
        beforeEach(function(done) {
            Reservation.create({
                catwayNumber: testCatway.catwayNumber,
                clientName: 'Jean Dupont',
                boatName: 'Le Petit Navire',
                startDate: new Date('2024-06-01'),
                endDate: new Date('2024-06-07')
            })
                .then(function(reservation) {
                    testReservation = reservation;
                    done();
                });
        });

        it('devrait lister les réservations d\'un catway', function(done) {
            request(app)
                .get('/api/catways/' + testCatway.catwayNumber + '/reservations')
                .set('Authorization', 'Bearer ' + userToken)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(Array.isArray(res.body)).toBe(true);
                    done();
                });
        });

        it('devrait créer une nouvelle réservation', function(done) {
            var newReservation = {
                clientName: 'Marie Martin',
                boatName: 'Le Grand Large',
                startDate: '2024-07-01',
                endDate: '2024-07-07'
            };

            request(app)
                .post('/api/catways/' + testCatway.catwayNumber + '/reservations')
                .set('Authorization', 'Bearer ' + userToken)
                .send(newReservation)
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.clientName).toBe(newReservation.clientName);
                    done();
                });
        });

        it('devrait récupérer une réservation spécifique', function(done) {
            request(app)
                .get('/api/catways/' + testCatway.catwayNumber + '/reservations/' + testReservation._id)
                .set('Authorization', 'Bearer ' + userToken)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body._id).toBe(testReservation._id.toString());
                    done();
                });
        });

        it('devrait mettre à jour une réservation', function(done) {
            var update = {
                clientName: 'Nouveau Client'
            };

            request(app)
                .put('/api/catways/' + testCatway.catwayNumber + '/reservations/' + testReservation._id)
                .set('Authorization', 'Bearer ' + userToken)
                .send(update)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.clientName).toBe(update.clientName);
                    done();
                });
        });

        it('devrait supprimer une réservation', function(done) {
            request(app)
                .delete('/api/catways/' + testCatway.catwayNumber + '/reservations/' + testReservation._id)
                .set('Authorization', 'Bearer ' + userToken)
                .expect(200, done);
        });
    });

    describe('Routes Auth', function() {
        it('devrait connecter un utilisateur avec des identifiants valides', function(done) {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: 'user@test.com',
                    password: 'Test123!'
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.token).toBeDefined();
                    done();
                });
        });

        it('devrait déconnecter l\'utilisateur', function(done) {
            request(app)
                .get('/api/auth/logout')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.message).toBe('Déconnexion réussie');
                    done();
                });
        });
    });

    describe('Routes Users', function() {
        it('devrait lister tous les utilisateurs en tant qu\'admin', function(done) {
            request(app)
                .get('/api/users')
                .set('Authorization', 'Bearer ' + adminToken)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(Array.isArray(res.body)).toBe(true);
                    done();
                });
        });

        it('devrait récupérer un utilisateur spécifique', function(done) {
            request(app)
                .get('/api/users/user@test.com')
                .set('Authorization', 'Bearer ' + adminToken)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.email).toBe('user@test.com');
                    done();
                });
        });

        it('devrait créer un nouvel utilisateur', function(done) {
            var newUser = {
                email: 'nouveau@test.com',
                password: 'Test123!',
                nom: 'Nouveau',
                prenom: 'User'
            };

            request(app)
                .post('/api/users')
                .set('Authorization', 'Bearer ' + adminToken)
                .send(newUser)
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.email).toBe(newUser.email);
                    done();
                });
        });

        it('devrait mettre à jour un utilisateur', function(done) {
            var update = {
                nom: 'Nouveau Nom',
                prenom: 'Nouveau Prénom'
            };

            request(app)
                .put('/api/users/user@test.com')
                .set('Authorization', 'Bearer ' + adminToken)
                .send(update)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.nom).toBe(update.nom);
                    done();
                });
        });

        it('devrait supprimer un utilisateur', function(done) {
            request(app)
                .delete('/api/users/user@test.com')
                .set('Authorization', 'Bearer ' + adminToken)
                .expect(200, done);
        });
    });
}); 