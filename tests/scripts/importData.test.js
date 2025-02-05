var Catway = require("../../server/models/catway");
var Reservation = require("../../server/models/reservation");
var importData = require("../../server/scripts/importData");
var testDb = require("../helpers/testDb");
var fs = require("fs");
var path = require("path");

describe("Tests d'Importation des Données", function () {
    var fixturesPath = path.join(__dirname, "..", "fixtures");

    beforeAll(function () {
        // Créer le dossier fixtures s'il n'existe pas
        if (!fs.existsSync(fixturesPath)) {
            fs.mkdirSync(fixturesPath);
        }

        // Créer les fichiers de test
        fs.writeFileSync(
            path.join(fixturesPath, "catways.json"),
            JSON.stringify([
                {
                    catwayNumber: "C01",
                    catwayType: "long",
                    catwayState: "disponible"
                }
            ])
        );

        fs.writeFileSync(
            path.join(fixturesPath, "reservations.json"),
            JSON.stringify([
                {
                    catwayNumber: "C01",
                    clientName: "Test Client",
                    boatName: "Test Boat",
                    startDate: "2024-06-01",
                    endDate: "2024-06-07"
                }
            ])
        );

        return testDb.connect();
    });

    afterAll(function () {
        // Nettoyer les fichiers de test
        fs.unlinkSync(path.join(fixturesPath, "catways.json"));
        fs.unlinkSync(path.join(fixturesPath, "reservations.json"));
        fs.rmdirSync(fixturesPath);

        return testDb.disconnect();
    });

    beforeEach(function () {
        return testDb.clearDatabase();
    });

    it("devrait importer les catways correctement", function () {
        // Simuler un fichier de données
        process.env.DATA_PATH = "./tests/fixtures";

        return importData
            .importCatways()
            .then(function () {
                return Catway.find();
            })
            .then(function (catways) {
                expect(catways.length).toBeGreaterThan(0);
                expect(catways[0].catwayNumber).toBeDefined();
            });
    });

    it("devrait importer les réservations correctement", function () {
        // Simuler un fichier de données
        process.env.DATA_PATH = "./tests/fixtures";

        return importData
            .importReservations()
            .then(function () {
                return Reservation.find();
            })
            .then(function (reservations) {
                expect(reservations.length).toBeGreaterThan(0);
                expect(reservations[0].catwayNumber).toBeDefined();
            });
    });

    it("devrait gérer les erreurs d'importation", function () {
        process.env.DATA_PATH = "/chemin/invalide";

        return importData.importCatways().catch(function (error) {
            expect(error).toBeDefined();
        });
    });
});
