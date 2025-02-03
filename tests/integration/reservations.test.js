const request = require('supertest');
const app = require('../../server/server');
const mongoose = require('mongoose');
const Reservation = require('../../server/models/reservation');
const Catway = require('../../server/models/catway');
const { generateToken } = require('../helpers/auth');

describe('Reservation Routes', () => {
    let token;
    let adminToken;
    let catway;

    beforeAll(async () => {
        token = generateToken({ role: 'user' });
        adminToken = generateToken({ role: 'admin' });
        
        catway = await Catway.create({
            catwayNumber: '1',
            catwayType: 'long',
            catwayState: 'disponible'
        });
    });

    beforeEach(async () => {
        await Reservation.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('GET /api/reservations', () => {
        it('should return all reservations', async () => {
            await Reservation.create([
                {
                    catwayNumber: catway.catwayNumber,
                    clientName: 'Client 1',
                    boatName: 'Boat 1',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 86400000)
                },
                {
                    catwayNumber: catway.catwayNumber,
                    clientName: 'Client 2',
                    boatName: 'Boat 2',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 86400000)
                }
            ]);

            const res = await request(app)
                .get('/api/reservations')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(2);
        });
    });

    describe('POST /api/reservations', () => {
        it('should create new reservation', async () => {
            const res = await request(app)
                .post('/api/reservations')
                .set('x-auth-token', token)
                .send({
                    catwayNumber: catway.catwayNumber,
                    clientName: 'Test Client',
                    boatName: 'Test Boat',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 86400000)
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('_id');
        });

        it('should not create reservation for non-existent catway', async () => {
            const res = await request(app)
                .post('/api/reservations')
                .set('x-auth-token', token)
                .send({
                    catwayNumber: '999',
                    clientName: 'Test Client',
                    boatName: 'Test Boat',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 86400000)
                });

            expect(res.status).toBe(400);
        });
    });
}); 