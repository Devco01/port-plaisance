const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs").promises;

// Charger les variables d'environnement
require("dotenv").config({
    path: path.resolve(__dirname, "../../.env")
});

// Importer les modèles
const User = require("../models/user");
const Catway = require("../models/catway");
const Reservation = require("../models/reservation");

async function loadJsonData() {
    try {
        const catwaysData = JSON.parse(
            await fs.readFile(path.resolve(__dirname, "../data/catways.json"), "utf-8")
        );
        const reservationsData = JSON.parse(
            await fs.readFile(path.resolve(__dirname, "../data/reservations.json"), "utf-8")
        );
        return { catwaysData, reservationsData };
    } catch (error) {
        console.error("❌ Erreur lors de la lecture des fichiers JSON:", error);
        throw error;
    }
}

const initDatabase = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connecté");

        // Initialiser les autres données (catways, etc.)
        const { catwaysData, reservationsData } = await loadJsonData();
        
        // ... initialisation des autres données ...

        await mongoose.disconnect();
        console.log("✅ Base de données initialisée");
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation:", error);
        process.exit(1);
    }
};

module.exports = initDatabase;

// Exécuter le script
initDatabase(); 