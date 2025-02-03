var request = require('supertest');
var app = require('../../server/app');
var User = require('../../server/models/user');
var testDb = require('../helpers/testDb');

describe('Auth Integration Tests', function() {
    beforeAll(function(done) {
        testDb.connect()
            .then(function() { done(); });
    });

    afterAll(function(done) {
        testDb.closeDatabase()
            .then(function() { done(); });
    });

    beforeEach(function(done) {
        testDb.clearDatabase()
            .then(function() { done(); });
    });

    describe('POST /api/auth/login', function() {
        var testUser = {
            email: 'test@test.com',
            password: 'Test123!',
            nom: 'Test',
            prenom: 'User'
        };

        beforeEach(function(done) {
            User.create(testUser)
                .then(function() { done(); });
        });

        it('should login with valid credentials', function(done) {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.token).toBeDefined();
                    done();
                });
        });

        it('should reject invalid credentials', function(done) {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                })
                .expect(401, done);
        });
    });

    describe('POST /api/auth/register', function() {
        var newUser = {
            email: 'new@test.com',
            password: 'NewTest123!',
            nom: 'New',
            prenom: 'User'
        };

        it('should register new user', function(done) {
            request(app)
                .post('/api/auth/register')
                .send(newUser)
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.token).toBeDefined();
                    done();
                });
        });

        it('should reject duplicate email', function(done) {
            User.create(newUser)
                .then(function() {
                    return request(app)
                        .post('/api/auth/register')
                        .send(newUser);
                })
                .then(function(res) {
                    expect(res.status).toBe(400);
                    done();
                });
        });
    });
}); 