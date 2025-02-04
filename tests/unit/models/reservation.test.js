var Reservation = require('../../../server/models/reservation');
var Catway = require('../../../server/models/catway');
var testDb = require('../../helpers/testDb');

describe('Tests du Modèle Reservation', function() {
    var testCatway;

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
                return new Catway({
                    catwayNumber: 'C123',
                    catwayType: 'long',
                    catwayState: 'disponible'
                }).save();
            })
            .then(function(catway) {
                testCatway = catway;
                done();
            })
            .catch(done);
    });

    it('devrait créer une réservation valide', function(done) {
        var reservation = new Reservation({
            catwayNumber: testCatway.catwayNumber,
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-06-05')
        });

        reservation.save()
            .then(function(saved) {
                expect(saved.catwayNumber).toBe(testCatway.catwayNumber);
                expect(saved.clientName).toBe('John Doe');
                expect(saved.boatName).toBe('Sea Spirit');
                done();
            })
            .catch(done);
    });

    it('devrait rejeter une réservation sans catway', function(done) {
        var reservation = new Reservation({
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-06-05')
        });

        reservation.save()
            .then(function() {
                done(new Error('La réservation aurait dû être rejetée'));
            })
            .catch(function(error) {
                expect(error).toBeDefined();
                expect(error.name).toBe('ValidationError');
                done();
            });
    });

    it('devrait rejeter une réservation avec des dates invalides', function(done) {
        var reservation = new Reservation({
            catwayNumber: testCatway.catwayNumber,
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            startDate: new Date('2024-06-05'),
            endDate: new Date('2024-06-01') // Date de fin avant date de début
        });

        reservation.save()
            .then(function() {
                done(new Error('La réservation aurait dû être rejetée'));
            })
            .catch(function(error) {
                expect(error).toBeDefined();
                expect(error.name).toBe('ValidationError');
                done();
            });
    });

    it('devrait permettre de mettre à jour une réservation', function(done) {
        var reservation = new Reservation({
            catwayNumber: testCatway.catwayNumber,
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-06-05')
        });

        reservation.save()
            .then(function(saved) {
                saved.clientName = 'Jane Doe';
                return saved.save();
            })
            .then(function(updated) {
                expect(updated.clientName).toBe('Jane Doe');
                done();
            })
            .catch(done);
    });

    it('devrait vérifier les chevauchements de dates', function(done) {
        // Première réservation
        var reservation1 = new Reservation({
            catwayNumber: testCatway.catwayNumber,
            clientName: 'Client 1',
            boatName: 'Boat 1',
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-06-05')
        });

        // Deuxième réservation avec dates qui se chevauchent
        var reservation2 = new Reservation({
            catwayNumber: testCatway.catwayNumber,
            clientName: 'Client 2',
            boatName: 'Boat 2',
            startDate: new Date('2024-06-03'),
            endDate: new Date('2024-06-07')
        });

        reservation1.save()
            .then(function() {
                return reservation2.save();
            })
            .then(function() {
                done(new Error('La deuxième réservation aurait dû être rejetée'));
            })
            .catch(function(error) {
                try {
                    expect(error).toBeDefined();
                    expect(error.message.toLowerCase()).toContain('chevauchement');
                    done();
                } catch (err) {
                    done(err);
                }
            });
    });
}); 