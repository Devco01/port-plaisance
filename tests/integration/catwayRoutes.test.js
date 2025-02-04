var request = require('supertest');
var app = require('../../server/app');
var User = require('../../server/models/user');
var Catway = require('../../server/models/catway');
var Reservation = require('../../server/models/reservation');
var testDb = require('../helpers/testDb');
var jwt = require('jsonwebtoken');

describe('Tests d\'Intégration des Routes Catway', function() {
    var userToken;
    var adminToken;
    var testCatway;

    beforeAll(function(done) {
        testDb.connect()
            .then(function() {
                done();
            })
            .catch(done);
    });

    afterAll(function(done) {
        testDb.disconnect()
            .then(function() {
                done();
            })
            .catch(done);
    });

    beforeEach(function(done) {
        testDb.clearDatabase()
            .then(function() {
                return Promise.all([
                    User.create({
                        email: 'test@example.com',
                        password: 'Password123!',
                        role: 'user',
                        nom: 'Test',
                        prenom: 'User'
                    }),
                    User.create({
                        email: 'admin@example.com',
                        password: 'AdminPass123!',
                        role: 'admin',
                        nom: 'Admin',
                        prenom: 'System'
                    })
                ]);
            })
            .then(function(users) {
                var user = users[0];
                var admin = users[1];

                userToken = jwt.sign(
                    { id: user._id, role: user.role },
                    process.env.JWT_SECRET || 'test_secret'
                );
                adminToken = jwt.sign(
                    { id: admin._id, role: admin.role },
                    process.env.JWT_SECRET || 'test_secret'
                );

                testCatway = {
                    catwayNumber: 'C123',
                    catwayType: 'long',
                    catwayState: 'disponible'
                };

                return Catway.create(testCatway);
            })
            .then(function(catway) {
                testCatway = catway;
                done();
            })
            .catch(done);
    });

    describe('GET /api/catways', function() {
        it('devrait lister les catways', function(done) {
            request(app)
                .get('/api/catways')
                .set('Authorization', 'Bearer ' + userToken)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBeGreaterThan(0);
                    done();
                });
        });
    });

    describe('POST /api/catways', function() {
        it('devrait créer un nouveau catway avec un admin', function(done) {
            var newCatway = {
                catwayNumber: 'C124',
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

        it('devrait refuser la création pour un utilisateur non admin', function(done) {
            request(app)
                .post('/api/catways')
                .set('Authorization', 'Bearer ' + userToken)
                .send(testCatway)
                .expect(403)
                .end(done);
        });
    });

    describe('PUT /api/catways/:id', function() {
        it('devrait modifier un catway existant avec un admin', function(done) {
            request(app)
                .put('/api/catways/' + testCatway.catwayNumber)
                .set('Authorization', 'Bearer ' + adminToken)
                .send({ catwayState: 'maintenance' })
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.catwayState).toBe('maintenance');
                    done();
                });
        });
    });

    describe('DELETE /api/catways/:id', function() {
        it('devrait supprimer un catway avec un admin', function(done) {
            request(app)
                .delete('/api/catways/' + testCatway.catwayNumber)
                .set('Authorization', 'Bearer ' + adminToken)
                .expect(200)
                .end(done);
        });

        it('devrait refuser la suppression pour un utilisateur non admin', function(done) {
            request(app)
                .delete('/api/catways/' + testCatway.catwayNumber)
                .set('Authorization', 'Bearer ' + userToken)
                .expect(403)
                .end(done);
        });

        it('devrait empêcher la suppression d\'un catway avec des réservations', function(done) {
            var reservation = new Reservation({
                catwayNumber: testCatway.catwayNumber,
                clientName: 'Test Client',
                boatName: 'Test Boat',
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000)
            });

            reservation.save()
                .then(function() {
                    request(app)
                        .delete('/api/catways/' + testCatway.catwayNumber)
                        .set('Authorization', 'Bearer ' + adminToken)
                        .expect(400)
                        .end(done);
                })
                .catch(done);
        });
    });
}); 