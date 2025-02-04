var mongoose = require('mongoose');
var User = require('../../../server/models/user');

describe('Tests du Modèle User', function() {
    beforeAll(function(done) {
        mongoose.connect(global.__MONGO_URI__)
            .then(function() { done(); });
    });

    afterAll(function(done) {
        mongoose.connection.close()
            .then(function() { done(); });
    });

    beforeEach(function(done) {
        User.deleteMany({})
            .then(function() { done(); });
    });

    it('devrait créer et sauvegarder un utilisateur valide', function(done) {
        var validUser = {
            email: 'test@test.com',
            password: 'Test123!',
            nom: 'Test',
            prenom: 'User',
            role: 'user'
        };

        var user = new User(validUser);
        user.save()
            .then(function(saved) {
                expect(saved._id).toBeDefined();
                expect(saved.email).toBe(validUser.email);
                expect(saved.password).not.toBe(validUser.password); // Le mot de passe doit être hashé
                done();
            });
    });

    it('devrait rejeter un email invalide', function(done) {
        var userWithInvalidEmail = {
            email: 'invalidemail',
            password: 'Test123!',
            nom: 'Test',
            prenom: 'User',
            role: 'user'
        };

        var user = new User(userWithInvalidEmail);
        user.save()
            .catch(function(error) {
                expect(error).toBeDefined();
                expect(error.errors.email).toBeDefined();
                done();
            });
    });

    it('devrait rejeter un mot de passe trop court', function(done) {
        var userWithShortPassword = {
            email: 'test@test.com',
            password: '123',
            nom: 'Test',
            prenom: 'User',
            role: 'user'
        };

        var user = new User(userWithShortPassword);
        user.save()
            .catch(function(error) {
                expect(error).toBeDefined();
                expect(error.errors.password).toBeDefined();
                done();
            });
    });

    it('devrait rejeter un email dupliqué', function(done) {
        var user1 = new User({
            email: 'test@test.com',
            password: 'Test123!',
            nom: 'Test1',
            prenom: 'User1',
            role: 'user'
        });

        user1.save()
            .then(function() {
                var user2 = new User({
                    email: 'test@test.com', // email dupliqué
                    password: 'Test456!',
                    nom: 'Test2',
                    prenom: 'User2',
                    role: 'user'
                });
                return user2.save();
            })
            .catch(function(error) {
                expect(error.code).toBe(11000); // code MongoDB pour clé dupliquée
                done();
            });
    });

    it('devrait comparer correctement les mots de passe', function(done) {
        var user = new User({
            email: 'test@test.com',
            password: 'Test123!',
            nom: 'Test',
            prenom: 'User',
            role: 'user'
        });

        user.save()
            .then(function(saved) {
                return saved.comparePassword('Test123!');
            })
            .then(function(isMatch) {
                expect(isMatch).toBe(true);
                done();
            });
    });
}); 