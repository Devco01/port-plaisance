var request = require("supertest");
var app = require("../../server/app");
var User = require("../../server/models/user");
var Catway = require("../../server/models/catway");
var Reservation = require("../../server/models/reservation");
var testDb = require("../helpers/testDb");

describe("Tests des Routes de Réservations", function () {
    var userToken;
    var testCatway;

    beforeAll(function (done) {
        testDb
            .connect()
            .then(function () {
                // Créer un utilisateur test
                return new User({
                    email: "test@test.com",
                    password: "Password123!",
                    role: "user",
                    nom: "Test",
                    prenom: "User"
                }).save();
            })
            .then(function () {
                // Créer un catway test
                return new Catway({
                    catwayNumber: "C123",
                    catwayType: "long",
                    catwayState: "disponible"
                }).save();
            })
            .then(function (catway) {
                testCatway = catway;
                // Connecter l'utilisateur pour obtenir un token
                return request(app).post("/api/auth/login").send({
                    email: "test@test.com",
                    password: "Password123!"
                });
            })
            .then(function (res) {
                userToken = res.body.token;
                done();
            })
            .catch(done);
    });

    beforeEach(function (done) {
        // Nettoyer puis créer une réservation test
        Reservation.deleteMany({})
            .then(function () {
                return new Reservation({
                    catwayNumber: testCatway.catwayNumber,
                    clientName: "Test Client",
                    boatName: "Test Boat",
                    startDate: new Date("2024-06-01"),
                    endDate: new Date("2024-06-05")
                }).save();
            })
            .then(function () {
                done();
            })
            .catch(done);
    });

    afterAll(function (done) {
        testDb
            .disconnect()
            .then(function () {
                done();
            })
            .catch(done);
    });

    describe("GET /api/catways/:id/reservations", function () {
        it("devrait lister les réservations", function (done) {
            request(app)
                .get(
                    "/api/catways/" + testCatway.catwayNumber + "/reservations"
                )
                .set("Authorization", "Bearer " + userToken)
                .expect(200)
                .expect(function (res) {
                    expect(res.body).toBeDefined();
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBe(1);
                    expect(res.body[0].catwayNumber).toBe(
                        testCatway.catwayNumber
                    );
                })
                .end(done);
        });
    });

    describe("POST /api/catways/:id/reservations", function () {
        it("devrait créer une nouvelle réservation", function (done) {
            var newReservation = {
                clientName: "Test Client",
                boatName: "Test Boat",
                startDate: "2024-07-01",
                endDate: "2024-07-05"
            };

            request(app)
                .post(
                    "/api/catways/" + testCatway.catwayNumber + "/reservations"
                )
                .set("Authorization", "Bearer " + userToken)
                .send(newReservation)
                .expect(201)
                .end(done);
        });
    });
});
