var request = require('supertest');
var app = require('../../server/app');
var Catway = require('../../server/models/catway');
var User = require('../../server/models/user');
var testDb = require('../helpers/testDb');
var auth = require('../helpers/auth');

describe('Catways Integration Tests', function() {
    var adminToken;
    var userToken;
    var testCatway;

    beforeAll(function(done) {
        testDb.connect()
            .then(function() {
                return Promise.all([
                    User.create({
                        email: 'admin@test.com',
                        password: 'Admin123!',
                        role: 'admin',
                        nom: 'Admin',
                        prenom: 'Test'
                    }),
                    User.create({
                        email: 'user@test.com',
                        password: 'User123!',
                        role: 'user',
                        nom: 'User',
                        prenom: 'Test'
                    })
                ]);
            })
            .then(function(users) {
                adminToken = auth.generateToken({ id: users[0]._id, role: 'admin' });
                userToken = auth.generateToken({ id: users[1]._id, role: 'user' });
                done();
            });
    });

    afterAll(function(done) {
        testDb.closeDatabase()
            .then(function() { done(); });
    });

    beforeEach(function(done) {
        testDb.clearDatabase()
            .then(function() {
                return Catway.create({
                    catwayNumber: 'A1',
                    catwayType: 'long',
                    catwayState: 'disponible'
                });
            })
            .then(function(catway) {
                testCatway = catway;
                done();
            });
    });

    describe('GET /api/catways', function() {
        it('should get all catways', function(done) {
            request(app)
                .get('/api/catways')
                .set('Authorization', 'Bearer ' + userToken)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBe(1);
                    done();
                });
        });
    });

    describe('POST /api/catways', function() {
        it('should create new catway as admin', function(done) {
            var newCatway = {
                catwayNumber: 'A2',
                catwayType: 'short',
                catwayState: 'disponible'
            };

            request(app)
                .post('/api/catways')
                .set('Authorization', 'Bearer ' + adminToken)
                .send(newCatway)
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.catwayNumber).toBe(newCatway.catwayNumber);
                    done();
                });
        });

        it('should reject creation by normal user', function(done) {
            var newCatway = {
                catwayNumber: 'A2',
                catwayType: 'short',
                catwayState: 'disponible'
            };

            request(app)
                .post('/api/catways')
                .set('Authorization', 'Bearer ' + userToken)
                .send(newCatway)
                .expect(403, done);
        });
    });

    describe('PUT /api/catways/:id', function() {
        it('should update catway as admin', function(done) {
            request(app)
                .put('/api/catways/' + testCatway.catwayNumber)
                .set('Authorization', 'Bearer ' + adminToken)
                .send({ catwayState: 'maintenance' })
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.catwayState).toBe('maintenance');
                    done();
                });
        });
    });
}); 