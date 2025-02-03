const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/app');
const Catway = require('../../server/models/catway');
const Reservation = require('../../server/models/reservation');
const User = require('../../server/models/User');
const jwt = require('jsonwebtoken');

describe('Reservation API Routes', () => {
    let token;
    let testCatway;
    const testReservation = {
        clientName: "John Doe",
        boatName: "Sea Spirit",
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-07')
    };

    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'Test123!',
            role: 'user'
        });
        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        // Créer un catway pour les tests
        testCatway = await Catway.create({
            catwayNumber: "A1",
            catwayType: "long",
            catwayState: "disponible"
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Reservation.deleteMany({});
    });

    describe('GET /api/catways/:id/reservations', () => {
        test('devrait retourner les réservations d\'un catway', async () => {
            const reservation = await Reservation.create({
                ...testReservation,
                catwayNumber: testCatway.catwayNumber
            });

            const res = await request(app)
                .get(`/api/catways/${testCatway.catwayNumber}/reservations`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(1);
            expect(res.body[0].catwayNumber).toBe(testCatway.catwayNumber);
        });

        test('devrait retourner 404 pour un catway inexistant', async () => {
            const res = await request(app)
                .get('/api/catways/INVALID/reservations')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /api/catways/:id/reservations', () => {
        test('devrait créer une nouvelle réservation', async () => {
            const res = await request(app)
                .post(`/api/catways/${testCatway.catwayNumber}/reservations`)
                .set('Authorization', `Bearer ${token}`)
                .send(testReservation);

            expect(res.status).toBe(201);
            expect(res.body.catwayNumber).toBe(testCatway.catwayNumber);
            expect(res.body.clientName).toBe(testReservation.clientName);

            const reservation = await Reservation.findById(res.body._id);
            expect(reservation).toBeTruthy();
        });

        test('devrait rejeter une réservation avec des dates invalides', async () => {
            const res = await request(app)
                .post(`/api/catways/${testCatway.catwayNumber}/reservations`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...testReservation,
                    startDate: new Date('2024-06-07'),
                    endDate: new Date('2024-06-01')
                });

            expect(res.status).toBe(400);
        });

        test('devrait rejeter une réservation pour un catway déjà réservé', async () => {
            await Reservation.create({
                ...testReservation,
                catwayNumber: testCatway.catwayNumber
            });

            const res = await request(app)
                .post(`/api/catways/${testCatway.catwayNumber}/reservations`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...testReservation,
                    startDate: new Date('2024-06-03'),
                    endDate: new Date('2024-06-05')
                });

            expect(res.status).toBe(400);
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

    describe('DELETE /api/catways/:id/reservations/:idReservation', () => {
        test('devrait supprimer une réservation', async () => {
            const reservation = await Reservation.create({
                ...testReservation,
                catwayNumber: testCatway.catwayNumber
            });

            const res = await request(app)
                .delete(`/api/catways/${testCatway.catwayNumber}/reservations/${reservation._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);

            const deletedReservation = await Reservation.findById(reservation._id);
            expect(deletedReservation).toBeNull();
        });
    });
}); 