var request = require('supertest');
var app = require('../../server/app');
var Reservation = require('../../server/models/reservation');
var Catway = require('../../server/models/catway');
var User = require('../../server/models/user');
var testDb = require('../helpers/testDb');
var auth = require('../helpers/auth');

describe('CRUD Reservations', function() {
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
                userToken = auth.generateToken({ id: results[0]._id, role: 'user' });
                adminToken = auth.generateToken({ id: results[1]._id, role: 'admin' });
                testCatway = results[2];
                done();
            });
    });

    beforeEach(function(done) {
        var reservationData = {
            catwayNumber: testCatway.catwayNumber,
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-06-07')
        };

        Reservation.create(reservationData)
            .then(function(reservation) {
                testReservation = reservation;
                done();
            });
    });

    afterEach(function(done) {
        Reservation.deleteMany({})
            .then(function() { done(); });
    });

    afterAll(function(done) {
        testDb.closeDatabase()
            .then(function() { done(); });
    });

    describe('Create', function() {
        it('devrait créer une nouvelle réservation', function(done) {
            var newReservation = {
                catwayNumber: testCatway.catwayNumber,
                clientName: 'Jane Doe',
                boatName: 'Ocean Dream',
                startDate: new Date('2024-07-01'),
                endDate: new Date('2024-07-07')
            };

            request(app)
                .post('/api/reservations')
                .set('Authorization', 'Bearer ' + userToken)
                .send(newReservation)
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.clientName).toBe(newReservation.clientName);
                    done();
                });
        });
    });

    describe('Read', function() {
        it('devrait lire une réservation existante', function(done) {
            request(app)
                .get('/api/reservations/' + testReservation._id)
                .set('Authorization', 'Bearer ' + userToken)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.clientName).toBe(testReservation.clientName);
                    done();
                });
        });
    });

    describe('Update', function() {
        it('devrait mettre à jour une réservation', function(done) {
            var updates = {
                clientName: 'Updated Name'
            };

            request(app)
                .put('/api/reservations/' + testReservation._id)
                .set('Authorization', 'Bearer ' + userToken)
                .send(updates)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.clientName).toBe(updates.clientName);
                    done();
                });
        });
    });

    describe('Delete', function() {
        it('devrait supprimer une réservation', function(done) {
            request(app)
                .delete('/api/reservations/' + testReservation._id)
                .set('Authorization', 'Bearer ' + adminToken)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    Reservation.findById(testReservation._id)
                        .then(function(reservation) {
                            expect(reservation).toBeNull();
                            done();
                        });
                });
        });
    });
}); 