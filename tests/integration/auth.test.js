const request = require('supertest');
const app = require('../../server/server');
const User = require('../../server/models/user');
const mongoose = require('mongoose');

describe('Auth Routes', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/users/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'test@test.com',
                    password: 'password123',
                    nom: 'Test',
                    prenom: 'User'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
        });

        it('should not register user with existing email', async () => {
            await User.create({
                email: 'test@test.com',
                password: 'password123',
                nom: 'Test',
                prenom: 'User'
            });

            const res = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'test@test.com',
                    password: 'password123',
                    nom: 'Test',
                    prenom: 'User'
                });

            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/users/login', () => {
        beforeEach(async () => {
            await User.create({
                email: 'test@test.com',
                password: 'password123',
                nom: 'Test',
                prenom: 'User'
            });
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'test@test.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should not login with invalid password', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'test@test.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(400);
        });
    });
}); 