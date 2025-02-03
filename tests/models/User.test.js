var mongoose = require('mongoose');
var User = require('../../server/models/user');

describe('User Model Test', function() {
    beforeAll(function(done) {
        mongoose.connect(global.__MONGO_URI__)
            .then(function() { done(); });
    });

    afterAll(function(done) {
        mongoose.connection.close()
            .then(function() { done(); });
    });

    it('should validate a valid user', function(done) {
        var validUser = {
            email: 'test@test.com',
            password: 'password123',
            nom: 'Doe',
            prenom: 'John'
        };

        var user = new User(validUser);
        user.save()
            .then(function(saved) {
                expect(saved._id).toBeDefined();
                done();
            });
    });

    it('should fail validation for invalid email', function(done) {
        var userWithInvalidEmail = {
            email: 'invalid-email',
            password: 'password123',
            nom: 'Doe',
            prenom: 'John'
        };

        var user = new User(userWithInvalidEmail);
        user.save()
            .catch(function(error) {
                expect(error).toBeDefined();
                done();
            });
    });

    it('should fail validation for short password', function(done) {
        var userWithShortPassword = {
            email: 'test@test.com',
            password: '123',
            nom: 'Doe',
            prenom: 'John'
        };

        var user = new User(userWithShortPassword);
        user.save()
            .catch(function(error) {
                expect(error).toBeDefined();
                done();
            });
    });
}); 