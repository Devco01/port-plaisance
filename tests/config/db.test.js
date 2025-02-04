var mongoose = require("mongoose");
var testDb = require("../helpers/testDb");

describe("Tests de Configuration de la Base de Données", function () {
    beforeAll(function (done) {
        testDb
            .connect()
            .then(function () {
                done();
            })
            .catch(done);
    }, 30000);

    afterAll(function (done) {
        testDb
            .disconnect()
            .then(function () {
                done();
            })
            .catch(done);
    }, 30000);

    it("devrait se connecter à la base de données", function (done) {
        expect(mongoose.connection.readyState).toBe(1);
        done();
    });

    it("devrait nettoyer la base de données", function (done) {
        var TestModel = mongoose.model(
            "Test",
            new mongoose.Schema({
                name: String
            })
        );

        TestModel.create({ name: "test" })
            .then(function () {
                return testDb.clearDatabase();
            })
            .then(function () {
                return TestModel.countDocuments();
            })
            .then(function (count) {
                expect(count).toBe(0);
                done();
            })
            .catch(done);
    });
});
