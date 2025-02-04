var Catway = require('../../../server/models/catway');
var testDb = require('../../helpers/testDb');

describe('Tests du Modèle Catway', function() {
    beforeAll(function(done) {
        testDb.connect()
            .then(function() {
                done();
            })
            .catch(done);
    });

    afterAll(function(done) {
        testDb.disconnect()
            .then(function() {
                done();
            })
            .catch(done);
    });

    beforeEach(function(done) {
        testDb.clearDatabase()
            .then(function() {
                done();
            })
            .catch(done);
    });

    it('devrait créer un catway valide', function(done) {
        var catway = new Catway({
            catwayNumber: 'C123',
            catwayType: 'long',
            catwayState: 'disponible'
        });

        catway.save()
            .then(function(saved) {
                expect(saved.catwayNumber).toBe('C123');
                expect(saved.catwayType).toBe('long');
                expect(saved.catwayState).toBe('disponible');
                done();
            })
            .catch(done);
    });

    it('devrait rejeter un catway sans numéro', function(done) {
        var catway = new Catway({
            catwayType: 'long',
            catwayState: 'disponible'
        });

        catway.save()
            .then(function() {
                done(new Error('Devrait rejeter un catway sans numéro'));
            })
            .catch(function(error) {
                expect(error).toBeDefined();
                done();
            });
    });

    it('devrait rejeter un type de catway invalide', function(done) {
        var catway = new Catway({
            catwayNumber: 'C123',
            catwayType: 'invalid',
            catwayState: 'disponible'
        });

        catway.save()
            .then(function() {
                done(new Error('Devrait rejeter un type de catway invalide'));
            })
            .catch(function(error) {
                expect(error).toBeDefined();
                done();
            });
    });

    it('devrait rejeter un état de catway invalide', function(done) {
        var catway = new Catway({
            catwayNumber: 'C123',
            catwayType: 'long',
            catwayState: 'invalid'
        });

        catway.save()
            .then(function() {
                done(new Error('Devrait rejeter un état de catway invalide'));
            })
            .catch(function(error) {
                expect(error).toBeDefined();
                done();
            });
    });

    it('devrait empêcher les doublons de numéro de catway', function(done) {
        var catway1 = new Catway({
            catwayNumber: 'C123',
            catwayType: 'long',
            catwayState: 'disponible'
        });

        var catway2 = new Catway({
            catwayNumber: 'C123',
            catwayType: 'short',
            catwayState: 'disponible'
        });

        catway1.save()
            .then(function() {
                return catway2.save();
            })
            .then(function() {
                done(new Error('Devrait rejeter le doublon'));
            })
            .catch(function(error) {
                expect(error).toBeDefined();
                done();
            });
    });

    it('devrait mettre à jour l\'état du catway', function(done) {
        var catway = new Catway({
            catwayNumber: 'C123',
            catwayType: 'long',
            catwayState: 'disponible'
        });

        catway.save()
            .then(function(saved) {
                saved.catwayState = 'maintenance';
                return saved.save();
            })
            .then(function(updated) {
                expect(updated.catwayState).toBe('maintenance');
                done();
            })
            .catch(done);
    });
}); 