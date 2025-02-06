const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Charger les variables d'environnement avec le bon chemin
require("dotenv").config({
    path: path.resolve(__dirname, "../../.env")
});

async function resetAdmin() {
    try {
        // Vérifier que l'URI est bien chargée
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI n'est pas définie dans le fichier .env");
        }
        
        console.log("Tentative de connexion à MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connexion à MongoDB réussie");

        // Supprimer l'admin existant
        const deleteResult = await User.deleteOne({ email: "admin@portplaisance.fr" });
        console.log("Admin supprimé:", deleteResult);

        // Créer le nouvel admin avec le mot de passe en clair
        const newAdmin = new User({
            username: "Admin",
            email: "admin@portplaisance.fr",
            password: "PortAdmin2024!", // Le middleware pre-save va le hasher
            role: "admin",
            nom: "Port",
            prenom: "Admin"
        });

        // Sauvegarder pour déclencher le middleware pre-save
        await newAdmin.save();

        // Vérifier immédiatement que le mot de passe fonctionne
        const testPassword = await newAdmin.comparePassword("PortAdmin2024!");
        console.log("Test de vérification du mot de passe:", testPassword);

        console.log("✅ Nouvel administrateur créé avec succès:", {
            id: newAdmin._id,
            email: newAdmin.email,
            role: newAdmin.role,
            password: "***"
        });

        await mongoose.disconnect();
        console.log("Déconnexion de MongoDB");
        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur:", error);
        process.exit(1);
    }
}

resetAdmin(); 