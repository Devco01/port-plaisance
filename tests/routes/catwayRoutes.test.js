const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/app');
const Catway = require('../../server/models/catway');
const User = require('../../server/models/user');
const jwt = require('jsonwebtoken');

describe('Catway API Routes', () => {
    let token;
    const testCatway = {
        catwayNumber: "A1",
        catwayType: "long",
        catwayState: "disponible"
    };

    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Créer un utilisateur test et générer son token
        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'Test123!',
            role: 'user'
        });
        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Catway.deleteMany({});
    });

    describe('GET /api/catways', () => {
        test('devrait retourner la liste des catways', async () => {
            await Catway.create(testCatway);

            const res = await request(app)
                .get('/api/catways')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(1);
            expect(res.body[0].catwayNumber).toBe(testCatway.catwayNumber);
        });

        test('devrait retourner 401 sans token', async () => {
            const res = await request(app).get('/api/catways');
            expect(res.status).toBe(401);
        });
    });

    describe('POST /api/catways', () => {
        test('devrait créer un nouveau catway', async () => {
            const res = await request(app)
                .post('/api/catways')
                .set('Authorization', `Bearer ${token}`)
                .send(testCatway);

            expect(res.status).toBe(201);
            expect(res.body.catwayNumber).toBe(testCatway.catwayNumber);

            const catway = await Catway.findOne({ catwayNumber: testCatway.catwayNumber });
            expect(catway).toBeTruthy();
        });

        test('devrait rejeter un catway avec un numéro existant', async () => {
            await Catway.create(testCatway);

            const res = await request(app)
                .post('/api/catways')
                .set('Authorization', `Bearer ${token}`)
                .send(testCatway);

            expect(res.status).toBe(400);
        });

        test('devrait rejeter un catway avec un type invalide', async () => {
            const res = await request(app)
                .post('/api/catways')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...testCatway,
                    catwayType: 'invalid'
                });

            expect(res.status).toBe(400);
        });
    });

    describe('PUT /api/catways/:id', () => {
        test('devrait mettre à jour l\'état d\'un catway', async () => {
            const catway = await Catway.create(testCatway);
            const newState = 'maintenance';

            const res = await request(app)
                .put(`/api/catways/${catway.catwayNumber}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ catwayState: newState });

            expect(res.status).toBe(200);
            expect(res.body.catwayState).toBe(newState);

            const updatedCatway = await Catway.findOne({ catwayNumber: catway.catwayNumber });
            expect(updatedCatway.catwayState).toBe(newState);
        });

        test('ne devrait pas permettre de modifier le numéro ou le type', async () => {
            const catway = await Catway.create(testCatway);

            const res = await request(app)
                .put(`/api/catways/${catway.catwayNumber}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    catwayNumber: 'B1',
                    catwayType: 'short'
                });

            const unchangedCatway = await Catway.findOne({ catwayNumber: catway.catwayNumber });
            expect(unchangedCatway.catwayType).toBe(testCatway.catwayType);
            expect(unchangedCatway.catwayNumber).toBe(testCatway.catwayNumber);
        });
    });

    describe('DELETE /api/catways/:id', () => {
        test('devrait supprimer un catway', async () => {
            const catway = await Catway.create(testCatway);

            const res = await request(app)
                .delete(`/api/catways/${catway.catwayNumber}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);

            const deletedCatway = await Catway.findOne({ catwayNumber: catway.catwayNumber });
            expect(deletedCatway).toBeNull();
        });
    });
}); 