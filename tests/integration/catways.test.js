const request = require('supertest');
const app = require('../../server/server');
const mongoose = require('mongoose');
const Catway = require('../../server/models/catway');
const { generateToken } = require('../helpers/auth');

describe('Catway Routes', () => {
    let token;
    let adminToken;

    beforeAll(async () => {
        token = generateToken({ role: 'user' });
        adminToken = generateToken({ role: 'admin' });
    });

    beforeEach(async () => {
        await Catway.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('GET /api/catways', () => {
        it('should return all catways', async () => {
            await Catway.create([
                { catwayNumber: '1', catwayType: 'long', catwayState: 'disponible' },
                { catwayNumber: '2', catwayType: 'short', catwayState: 'occupé' }
            ]);

            const res = await request(app)
                .get('/api/catways')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(2);
        });

        it('should return 401 if no token provided', async () => {
            const res = await request(app).get('/api/catways');
            expect(res.status).toBe(401);
        });
    });

    describe('POST /api/catways', () => {
        it('should create new catway if admin', async () => {
            const res = await request(app)
                .post('/api/catways')
                .set('x-auth-token', adminToken)
                .send({
                    catwayNumber: '1',
                    catwayType: 'long',
                    catwayState: 'disponible'
                });

            expect(res.status).toBe(201);
            expect(res.body.catwayNumber).toBe('1');
        });

        it('should return 403 if not admin', async () => {
            const res = await request(app)
                .post('/api/catways')
                .set('x-auth-token', token)
                .send({
                    catwayNumber: '1',
                    catwayType: 'long',
                    catwayState: 'disponible'
                });

            expect(res.status).toBe(403);
        });
    });
}); 