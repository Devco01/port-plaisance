var mongoose = require('mongoose');
var Reservation = require('../../server/models/reservation');
var Catway = require('../../server/models/catway');

describe('Reservation Model Test', function() {
    var testCatway;

    beforeAll(function(done) {
        mongoose.connect(global.__MONGO_URI__)
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

    afterAll(function(done) {
        mongoose.connection.close()
            .then(function() { done(); });
    });

    beforeEach(function(done) {
        Reservation.deleteMany({})
            .then(function() { done(); });
    });

    it('should validate a valid reservation', function(done) {
        var validReservation = {
            catwayNumber: testCatway.catwayNumber,
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-06-07')
        };

        var reservation = new Reservation(validReservation);
        reservation.save()
            .then(function(saved) {
                expect(saved._id).toBeDefined();
                expect(saved.catwayNumber).toBe(testCatway.catwayNumber);
                done();
            });
    });

    it('should calculate price correctly', function(done) {
        var reservation = new Reservation({
            catwayNumber: testCatway.catwayNumber,
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-06-07')
        });

        reservation.save()
            .then(function(saved) {
                return saved.calculatePrice();
            })
            .then(function(updated) {
                expect(updated.totalPrice).toBe(300); // 6 jours * 50€
                done();
            });
    });

    it('should check availability correctly', function(done) {
        var reservation = new Reservation({
            catwayNumber: testCatway.catwayNumber,
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-06-07')
        });

        reservation.save()
            .then(function() {
                return Reservation.checkAvailability(
                    testCatway.catwayNumber,
                    new Date('2024-06-03'),
                    new Date('2024-06-05')
                );
            })
            .then(function(conflict) {
                expect(conflict).toBeTruthy();
                done();
            });
    });

    it('should cancel reservation correctly', function(done) {
        var reservation = new Reservation({
            catwayNumber: testCatway.catwayNumber,
            clientName: 'John Doe',
            boatName: 'Sea Spirit',
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-06-07')
        });

        reservation.save()
            .then(function(saved) {
                return saved.cancel();
            })
            .then(function(cancelled) {
                expect(cancelled.status).toBe('annulée');
                done();
            });
    });
}); 