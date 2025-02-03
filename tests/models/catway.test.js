var mongoose = require('mongoose');
var Catway = require('../../server/models/catway');

describe('Catway Model Test', function() {
    beforeAll(function(done) {
        mongoose.connect(global.__MONGO_URI__)
            .then(function() { done(); });
    });

    afterAll(function(done) {
        mongoose.connection.close()
            .then(function() { done(); });
    });

    it('should validate a valid catway', function(done) {
        var validCatway = {
            catwayNumber: 'A1',
            catwayType: 'long',
            catwayState: 'disponible'
        };

        var catway = new Catway(validCatway);
        catway.save()
            .then(function(saved) {
                expect(saved._id).toBeDefined();
                expect(saved.catwayNumber).toBe('A1');
                done();
            });
    });

    it('should fail validation for invalid catway type', function(done) {
        var invalidCatway = {
            catwayNumber: 'A2',
            catwayType: 'invalid',
            catwayState: 'disponible'
        };

        var catway = new Catway(invalidCatway);
        catway.save()
            .catch(function(error) {
                expect(error).toBeDefined();
                expect(error.errors.catwayType).toBeDefined();
                done();
            });
    });

    it('should update catway state correctly', function(done) {
        var catway = new Catway({
            catwayNumber: 'A3',
            catwayType: 'long',
            catwayState: 'disponible'
        });

        catway.save()
            .then(function(saved) {
                return saved.updateState('maintenance');
            })
            .then(function(updated) {
                expect(updated.catwayState).toBe('maintenance');
                done();
            });
    });

    it('should check availability correctly', function(done) {
        var catway = new Catway({
            catwayNumber: 'A4',
            catwayType: 'short',
            catwayState: 'disponible'
        });

        catway.save()
            .then(function(saved) {
                expect(saved.isAvailable()).toBe(true);
                return saved.updateState('occupé');
            })
            .then(function(updated) {
                expect(updated.isAvailable()).toBe(false);
                done();
            });
    });
}); 