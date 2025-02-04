var request = require('supertest');
var app = require('../../server/app');
var User = require('../../server/models/user');
var bcrypt = require('bcrypt');

describe('Auth Tests', function() {
    var testUser = {
        email: 'test@test.com',
        password: 'Test123!',
        nom: 'Test',
        prenom: 'User'
    };

    beforeEach(function(done) {
        bcrypt.hash(testUser.password, 10)
            .then(function(hash) {
                return User.create({
                    ...testUser,
                    password: hash
                });
            })
            .then(function() {
                done();
            });
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

    it('should fail with invalid password', function(done) {
        request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword'
            })
            .expect(401, done);
    });
}); 