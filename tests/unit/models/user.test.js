var User = require("../../../server/models/user");
var testDb = require("../../helpers/testDb");

describe("Tests du Modèle User", function () {
    beforeAll(function (done) {
        testDb
            .connect()
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
                done();
            })
            .catch(done);
    });

    it("devrait créer un utilisateur valide", function (done) {
        var validUser = new User({
            email: "test@example.com",
            password: "Password123!",
            role: "user",
            nom: "Test",
            prenom: "User"
        });

        validUser
            .save()
            .then(function (savedUser) {
                expect(savedUser.email).toBe("test@example.com");
                expect(savedUser.role).toBe("user");
                expect(savedUser.nom).toBe("Test");
                expect(savedUser.prenom).toBe("User");
                done();
            })
            .catch(done);
    });

    it("devrait hasher le mot de passe avant la sauvegarde", function (done) {
        var user = new User({
            email: "test@example.com",
            password: "Password123!",
            role: "user",
            nom: "Test",
            prenom: "User"
        });

        user.save()
            .then(function (savedUser) {
                expect(savedUser.password).not.toBe("Password123!");
                expect(savedUser.password).toHaveLength(60);
                done();
            })
            .catch(done);
    });

    it("devrait valider le mot de passe correctement", function (done) {
        var user = new User({
            email: "test@example.com",
            password: "Password123!",
            role: "user",
            nom: "Test",
            prenom: "User"
        });

        user.save()
            .then(function (saved) {
                return saved.comparePassword("Password123!");
            })
            .then(function (isMatch) {
                expect(isMatch).toBe(true);
                done();
            })
            .catch(done);
    });

    it("devrait rejeter un mot de passe incorrect", function (done) {
        var user = new User({
            email: "test@example.com",
            password: "Password123!",
            role: "user",
            nom: "Test",
            prenom: "User"
        });

        user.save()
            .then(function (saved) {
                return saved.comparePassword("WrongPassword");
            })
            .then(function (isMatch) {
                expect(isMatch).toBe(false);
                done();
            })
            .catch(done);
    });

    it("devrait rejeter un email invalide", function (done) {
        var user = new User({
            email: "invalid-email",
            password: "Password123!",
            role: "user",
            nom: "Test",
            prenom: "User"
        });

        user.save().catch(function (err) {
            expect(err).toBeDefined();
            done();
        });
    });

    it("devrait rejeter un mot de passe trop court", function (done) {
        var user = new User({
            email: "test@example.com",
            password: "short",
            role: "user",
            nom: "Test",
            prenom: "User"
        });

        user.save().catch(function (err) {
            expect(err).toBeDefined();
            done();
        });
    });

    it("devrait empêcher les doublons d'email", function (done) {
        var user1 = new User({
            email: "test@example.com",
            password: "Password123!",
            role: "user",
            nom: "Test",
            prenom: "User"
        });

        var user2 = new User({
            email: "test@example.com",
            password: "DifferentPass123!",
            role: "user",
            nom: "Test2",
            prenom: "User2"
        });

        user1
            .save()
            .then(function () {
                return user2.save();
            })
            .catch(function (err) {
                expect(err).toBeDefined();
                done();
            });
    });
});
