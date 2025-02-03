var request = require('supertest');
var app = require('../../server/app');
var Reservation = require('../../server/models/reservation');
var Catway = require('../../server/models/catway');
var User = require('../../server/models/user');
var testDb = require('../helpers/testDb');
var auth = require('../helpers/auth');

describe('Reservations Integration Tests', function() {
    var userToken;
    var adminToken;
    var testCatway;

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

    afterAll(function(done) {
        testDb.closeDatabase()
            .then(function() { done(); });
    });

    beforeEach(function(done) {
        testDb.clearDatabase()
            .then(function() { done(); });
    });

    describe('Gestion des réservations', function() {
        var testReservation = {
            catwayNumber: 'A1',
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-06-07')
        };

        it('devrait créer une réservation valide', function(done) {
            request(app)
                .post('/api/reservations')
                .set('Authorization', 'Bearer ' + userToken)
                .send(testReservation)
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.clientName).toBe(testReservation.clientName);
                    done();
                });
        });

        it('devrait lister les réservations', function(done) {
            Reservation.create(testReservation)
                .then(function() {
                    return request(app)
                        .get('/api/reservations')
                        .set('Authorization', 'Bearer ' + adminToken);
                })
                .then(function(res) {
                    expect(res.status).toBe(200);
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBe(1);
                    done();
                });
        });
    });
}); 