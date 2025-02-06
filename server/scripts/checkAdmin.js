require("dotenv").config();
console.log("CheckAdmin - URL MongoDB:", process.env.MONGODB_URI);
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const checkAndCreateAdmin = async () => {
    try {
        console.log("=== Vérification de l'administrateur ===");
        
        // Vérifier si un admin existe
        let admin = await User.findOne({ email: "admin@portplaisance.fr" });

        if (!admin) {
            console.log("Création de l'administrateur...");
            
            // Créer l'admin (le mot de passe sera hashé par le middleware pre-save)
            admin = await User.create({
                username: "admin",
                email: "admin@portplaisance.fr",
                password: "PortAdmin2024!",
                role: "admin"
            });
            console.log("✅ Administrateur créé");
        } else {
            console.log("✅ Un administrateur existe déjà");
            
            // Vérifier le mot de passe
            const isMatch = await admin.comparePassword("PortAdmin2024!");
            if (!isMatch) {
                console.log("⚠️ Réinitialisation du mot de passe admin...");
                admin.password = "PortAdmin2024!"; // Sera hashé par le middleware pre-save
                await admin.save();
                console.log("✅ Mot de passe admin mis à jour");
            }
        }

        return admin;
    } catch (error) {
        console.error("❌ Erreur lors de la vérification/création de l'admin:", error);
        throw error;
    }
};

module.exports = { checkAndCreateAdmin };
