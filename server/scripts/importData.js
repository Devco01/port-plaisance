const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs").promises;
const bcrypt = require("bcryptjs");

// Charger les variables d'environnement en premier
require("dotenv").config({
    path: path.resolve(__dirname, "../../.env")
});

// Importer les modèles après la config
const Catway = require("../models/catway");
const User = require("../models/user");
const Reservation = require("../models/reservation");

// Données échantillons
const sampleCatways = [
    {
        catwayNumber: 1,
        catwayType: "long",
        catwayState: "good"
    },
    {
        catwayNumber: 2,
        catwayType: "short",
        catwayState: "repair"
    },
    {
        catwayNumber: 3,
        catwayType: "long",
        catwayState: "good"
    },
    {
        catwayNumber: 4,
        catwayType: "short",
        catwayState: "good"
    },
    {
        catwayNumber: 5,
        catwayType: "long",
        catwayState: "maintenance"
    }
];

const sampleReservations = [
    {
        catwayNumber: 1,
        clientName: "Jean Dupont",
        boatName: "Le Petit Prince",
        startDate: "2024-01-01",
        endDate: "2024-01-15"
    },
    {
        catwayNumber: 2,
        clientName: "Marie Martin",
        boatName: "L'Aventurier",
        startDate: "2024-02-01",
        endDate: "2024-02-28"
    },
    {
        catwayNumber: 3,
        clientName: "Pierre Durand",
        boatName: "Belle Mer",
        startDate: "2024-01-15",
        endDate: "2024-03-15"
    }
];

async function importData() {
    try {
        // Connexion à MongoDB
        console.log("Tentative de connexion à MongoDB...");
        console.log("URI MongoDB:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connecté à MongoDB");

        // Lire les fichiers JSON
        console.log("Lecture des fichiers JSON...");
        const catwaysData = JSON.parse(
            await fs.readFile(path.resolve(__dirname, "../data/catways.json"), "utf-8")
        );
        const reservationsData = JSON.parse(
            await fs.readFile(path.resolve(__dirname, "../data/reservations.json"), "utf-8")
        );

        // Supprimer les données existantes
        console.log("Suppression des données existantes...");
        await Catway.deleteMany({});
        await Reservation.deleteMany({});
        console.log("🗑️ Données existantes supprimées");

        // Importer les catways
        console.log("Import des catways...");
        await Catway.insertMany(catwaysData);
        console.log("✅ Catways importés");

        // Importer les réservations
        console.log("Import des réservations...");
        await Reservation.insertMany(reservationsData);
        console.log("✅ Réservations importées");

        // Vérification
        const catwaysCount = await Catway.countDocuments();
        const reservationsCount = await Reservation.countDocuments();
        console.log(`Nombre de catways: ${catwaysCount}`);
        console.log(`Nombre de réservations: ${reservationsCount}`);

        console.log("✨ Import terminé avec succès");
        await mongoose.disconnect();
        console.log("Déconnexion de MongoDB");
        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur lors de l'import:", error);
        process.exit(1);
    }
}

// Exécuter l'import
importData();

function importUsers() {
    var dataPath = path.join(process.env.DATA_PATH || ".", "users.json");
    return new Promise(function (resolve, reject) {
        fs.readFile(dataPath, "utf8", function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            var users = JSON.parse(data);
            return Promise.all(
                users.map(function (user) {
                    return bcrypt.hash(user.password, 10).then(function (hash) {
                        user.password = hash;
                        return new User(user).save();
                    });
                })
            )
                .then(resolve)
                .catch(reject);
        });
    });
}

module.exports = {
    importCatways: function () {
        var dataPath = path.join(process.env.DATA_PATH || ".", "catways.json");
        return new Promise(function (resolve, reject) {
            fs.readFile(dataPath, "utf8", function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                var catways = JSON.parse(data);
                return Catway.insertMany(catways).then(resolve).catch(reject);
            });
        });
    },

    importReservations: function () {
        var dataPath = path.join(
            process.env.DATA_PATH || ".",
            "reservations.json"
        );
        return new Promise(function (resolve, reject) {
            fs.readFile(dataPath, "utf8", function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                var reservations = JSON.parse(data);
                return Reservation.insertMany(reservations)
                    .then(resolve)
                    .catch(reject);
            });
        });
    },

    importUsers: importUsers
};
