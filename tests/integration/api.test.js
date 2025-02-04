var request = require("supertest");
var app = require("../../server/app");
var User = require("../../server/models/user");
var Catway = require("../../server/models/catway");
var Reservation = require("../../server/models/reservation");
var testDb = require("../helpers/testDb");
var jwt = require("jsonwebtoken");

describe("Tests d'Intégration API", function () {
    var userToken;
    var adminToken;
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
                // Créer un admin test
                return new User({
                    email: "admin@test.com",
                    password: "Password123!",
                    role: "admin",
                    nom: "Admin",
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
                done();
            })
            .catch(done);
    });

    beforeEach(function (done) {
        // Nettoyer les réservations avant chaque test
        Reservation.deleteMany({})
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

    beforeEach(function (done) {
        testDb
            .clearDatabase()
            .then(function () {
                return Promise.all([
                    User.create({
                        email: "test@example.com",
                        password: "Password123!",
                        role: "user",
                        nom: "Test",
                        prenom: "User"
                    }),
                    User.create({
                        email: "admin@example.com",
                        password: "AdminPass123!",
                        role: "admin",
                        nom: "Admin",
                        prenom: "System"
                    }),
                    Catway.create({
                        catwayNumber: "C123",
                        catwayType: "long",
                        catwayState: "disponible"
                    })
                ]);
            })
            .then(function (results) {
                var user = results[0];
                var admin = results[1];

                userToken = jwt.sign(
                    { id: user._id, role: user.role },
                    process.env.JWT_SECRET || "test_secret"
                );
                adminToken = jwt.sign(
                    { id: admin._id, role: admin.role },
                    process.env.JWT_SECRET || "test_secret"
                );
                done();
            })
            .catch(done);
    });

    describe("Authentification", function () {
        it("devrait permettre la connexion avec des identifiants valides", function (done) {
            request(app)
                .post("/api/auth/login")
                .send({
                    email: "test@example.com",
                    password: "Password123!"
                })
                .expect(200)
                .end(done);
        });
    });

    describe("Gestion des Catways", function () {
        it("devrait lister les catways", function (done) {
            request(app)
                .get("/api/catways")
                .set("Authorization", "Bearer " + userToken)
                .expect(200)
                .end(done);
        });
    });

    describe("Gestion des Réservations", function () {
        beforeEach(function (done) {
            // Créer une réservation test
            var reservation = new Reservation({
                catwayNumber: testCatway.catwayNumber,
                clientName: "Test Client",
                boatName: "Test Boat",
                startDate: new Date("2024-06-01"),
                endDate: new Date("2024-06-05")
            });

            reservation
                .save()
                .then(function () {
                    done();
                })
                .catch(done);
        });

        it("devrait lister les réservations", function (done) {
            request(app)
                .get(
                    "/api/catways/" + testCatway.catwayNumber + "/reservations"
                )
                .set("Authorization", "Bearer " + userToken)
                .expect(200)
                .end(done);
        });
    });

    describe("Gestion des Utilisateurs", function () {
        it("devrait permettre à l'admin de lister les utilisateurs", function (done) {
            request(app)
                .get("/api/users")
                .set("Authorization", "Bearer " + adminToken)
                .expect(200)
                .end(done);
        });
    });
});
