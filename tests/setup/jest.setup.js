require("dotenv").config();

var mongoose = require("mongoose");
var testDb = require("../helpers/testDb");

// Configuration globale pour les tests
jest.setTimeout(90000);

// Mock des variables d'environnement
process.env.JWT_SECRET = "test_secret_key";
process.env.MONGODB_URI = "mongodb://localhost:27017/test_db";

// Liste des fichiers de test qui n'ont pas besoin de la base de données

beforeAll(function (done) {
    testDb
        .connect()
        .then(function () {
            done();
        })
        .catch(function (err) {
            console.error("Erreur de connexion à la base de test:", err);
            done(err);
        });
});

afterAll(function (done) {
    mongoose.connection
        .close()
        .then(function () {
            done();
        })
        .catch(function (err) {
            console.error("Erreur de déconnexion:", err);
            done(err);
        });
});

beforeEach(function (done) {
    if (!mongoose.connection.db) {
        return done();
    }

    var collections = mongoose.connection.collections;
    Promise.all(
        Object.keys(collections).map(function (key) {
            return collections[key].deleteMany({});
        })
    )
        .then(function () {
            done();
        })
        .catch(function (err) {
            console.error("Erreur de nettoyage de la base:", err);
            done(err);
        });
});

afterEach(function () {
    console.log("Test terminé");
});

// Gestion des erreurs non capturées pendant les tests
process.on("unhandledRejection", function (error) {
    console.error("Unhandled Promise Rejection:", error);
});
