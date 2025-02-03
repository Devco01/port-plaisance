const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/app');
const User = require('../../server/models/User');
const jwt = require('jsonwebtoken');

describe('User API Routes', () => {
    let adminToken, userToken;
    const testUser = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'Test123!',
        nom: 'Test',
        prenom: 'User',
        role: 'user'
    };

    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Créer un admin pour les tests
        const admin = await User.create({
            username: 'admin',
            email: 'admin@test.com',
            password: 'Admin123!',
            nom: 'Admin',
            prenom: 'Test',
            role: 'admin'
        });
        adminToken = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);

        // Créer un utilisateur normal pour les tests
        const user = await User.create(testUser);
        userToken = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({ role: 'user' });
    });

    describe('GET /api/users', () => {
        test('devrait retourner la liste des utilisateurs pour un admin', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.some(u => u.email === 'admin@test.com')).toBeTruthy();
        });

        test('devrait refuser l\'accès à un utilisateur non admin', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
        });
    });

    describe('GET /api/users/:email', () => {
        test('devrait retourner les détails d\'un utilisateur pour un admin', async () => {
            const user = await User.create(testUser);

            const res = await request(app)
                .get(`/api/users/${user.email}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.email).toBe(user.email);
            expect(res.body.password).toBeUndefined();
        });

        test('devrait permettre à un utilisateur d\'accéder à ses propres informations', async () => {
            const res = await request(app)
                .get('/api/users/test@test.com')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.email).toBe('test@test.com');
        });
    });

    describe('POST /api/users', () => {
        test('devrait créer un nouvel utilisateur en tant qu\'admin', async () => {
            const newUser = {
                username: 'newuser',
                email: 'new@test.com',
                password: 'NewUser123!',
                nom: 'New',
                prenom: 'User',
                role: 'user'
            };

            const res = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newUser);

            expect(res.status).toBe(201);
            expect(res.body.email).toBe(newUser.email);
            expect(res.body.password).toBeUndefined();

            const user = await User.findOne({ email: newUser.email });
            expect(user).toBeTruthy();
        });

        test('devrait rejeter un email déjà utilisé', async () => {
            const res = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(testUser);

            expect(res.status).toBe(400);
        });
    });

    describe('PUT /api/users/:email', () => {
        test('devrait mettre à jour un utilisateur', async () => {
            const user = await User.create(testUser);
            const updates = {
                username: 'updateduser',
                nom: 'Updated',
                prenom: 'User'
            };

            const res = await request(app)
                .put(`/api/users/${user.email}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updates);

            expect(res.status).toBe(200);
            expect(res.body.username).toBe(updates.username);
        });

        test('ne devrait pas permettre de modifier le rôle en tant qu\'utilisateur', async () => {
            const res = await request(app)
                .put('/api/users/test@test.com')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ role: 'admin' });

            expect(res.status).toBe(403);
        });
    });

    describe('DELETE /api/users/:email', () => {
        test('devrait supprimer un utilisateur en tant qu\'admin', async () => {
            const user = await User.create(testUser);

            const res = await request(app)
                .delete(`/api/users/${user.email}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);

            const deletedUser = await User.findOne({ email: user.email });
            expect(deletedUser).toBeNull();
        });

        test('ne devrait pas permettre de supprimer un admin', async () => {
            const res = await request(app)
                .delete('/api/users/admin@test.com')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(403);
        });
    });
}); 