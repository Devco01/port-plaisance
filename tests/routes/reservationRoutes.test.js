var request = require('supertest');
var mongoose = require('mongoose');
var app = require('../../server/app');
var Catway = require('../../server/models/catway');
var Reservation = require('../../server/models/reservation');
var User = require('../../server/models/user');
var jwt = require('jsonwebtoken');

describe('Reservation API Routes', function() {
    var token;
    var testCatway;
    var testReservation = {
        clientName: "John Doe",
        boatName: "Sea Spirit",
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-07')
    };

    beforeAll(function(done) {
        mongoose.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(function() {
                return User.create({
                    email: 'test@test.com',
                    password: 'Test123!',
                    role: 'user',
                    nom: 'Test',
                    prenom: 'User'
                });
            })
            .then(function(user) {
                token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                return Catway.create({
                    catwayNumber: "A1",
                    catwayType: "long",
                    catwayState: "disponible"
                });
            })
            .then(function(catway) {
                testCatway = catway;
                done();
            });
    });

    afterAll(function(done) {
        mongoose.connection.close()
            .then(function() { done(); });
    });

    beforeEach(function(done) {
        Reservation.deleteMany({})
            .then(function() { done(); });
    });

    describe('GET /api/catways/:id/reservations', function() {
        it('devrait retourner les réservations d\'un catway', function(done) {
            var reservationData = Object.assign({}, testReservation, {
                catwayNumber: testCatway.catwayNumber
            });

            Reservation.create(reservationData)
                .then(function() {
                    return request(app)
                        .get('/api/catways/' + testCatway.catwayNumber + '/reservations')
                        .set('Authorization', 'Bearer ' + token);
                })
                .then(function(res) {
                    expect(res.status).toBe(200);
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBe(1);
                    expect(res.body[0].catwayNumber).toBe(testCatway.catwayNumber);
                    done();
                });
        });

        it('devrait retourner 404 pour un catway inexistant', function(done) {
            request(app)
                .get('/api/catways/INVALID/reservations')
                .set('Authorization', 'Bearer ' + token)
                .expect(404, done);
        });
    });

    describe('POST /api/catways/:id/reservations', function() {
        it('devrait créer une nouvelle réservation', function(done) {
            request(app)
                .post('/api/catways/' + testCatway.catwayNumber + '/reservations')
                .set('Authorization', 'Bearer ' + token)
                .send(testReservation)
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.catwayNumber).toBe(testCatway.catwayNumber);
                    expect(res.body.clientName).toBe(testReservation.clientName);

                    Reservation.findById(res.body._id)
                        .then(function(reservation) {
                            expect(reservation).toBeTruthy();
                            done();
                        });
                });
        });

        it('devrait rejeter une réservation avec des dates invalides', function(done) {
            var invalidReservation = Object.assign({}, testReservation, {
                startDate: new Date('2024-06-07'),
                endDate: new Date('2024-06-01')
            });

            request(app)
                .post('/api/catways/' + testCatway.catwayNumber + '/reservations')
                .set('Authorization', 'Bearer ' + token)
                .send(invalidReservation)
                .expect(400, done);
        });

        it('devrait rejeter une réservation pour un catway déjà réservé', function(done) {
            var existingReservation = Object.assign({}, testReservation, {
                catwayNumber: testCatway.catwayNumber
            });

            Reservation.create(existingReservation)
                .then(function() {
                    var overlappingReservation = Object.assign({}, testReservation, {
                        startDate: new Date('2024-06-03'),
                        endDate: new Date('2024-06-05')
                    });

                    return request(app)
                        .post('/api/catways/' + testCatway.catwayNumber + '/reservations')
                        .set('Authorization', 'Bearer ' + token)
                        .send(overlappingReservation);
                })
                .then(function(res) {
                    expect(res.status).toBe(400);
                    done();
                });
        });
    });

    describe('PUT /api/catways/:id/reservations/:idReservation', () => {
        test('devrait mettre à jour une réservation', async () => {
            const reservation = await Reservation.create({
                ...testReservation,
                catwayNumber: testCatway.catwayNumber
            });

            const newClientName = 'Jane Doe';
            const res = await request(app)
                .put(`/api/catways/${testCatway.catwayNumber}/reservations/${reservation._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ clientName: newClientName });

            expect(res.status).toBe(200);
            expect(res.body.clientName).toBe(newClientName);
        });
    });

    describe('DELETE /api/catways/:id/reservations/:reservationId', function() {
        var testReservationId;

        beforeEach(function(done) {
            var reservationData = Object.assign({}, testReservation, {
                catwayNumber: testCatway.catwayNumber
            });

            Reservation.create(reservationData)
                .then(function(reservation) {
                    testReservationId = reservation._id;
                    done();
                });
        });

        it('devrait supprimer une réservation existante', function(done) {
            request(app)
                .delete('/api/catways/' + testCatway.catwayNumber + '/reservations/' + testReservationId)
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    Reservation.findById(testReservationId)
                        .then(function(reservation) {
                            expect(reservation).toBeNull();
                            done();
                        });
                });
        });

        it('devrait retourner 404 pour une réservation inexistante', function(done) {
            request(app)
                .delete('/api/catways/' + testCatway.catwayNumber + '/reservations/invalid_id')
                .set('Authorization', 'Bearer ' + token)
                .expect(404, done);
        });
    });
}); 