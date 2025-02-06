const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
require("dotenv").config();


const createAdmin = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI non définie dans les variables d'environnement");
        }
        
        console.log("URI MongoDB:", uri);
        console.log("Tentative de connexion à MongoDB...");
        await mongoose.connect(uri);
        console.log("Connexion à MongoDB réussie");

        // Vérifier la base de données actuelle
        const db = mongoose.connection.db;
        console.log("Base de données connectée:", db.databaseName);

        // Lister toutes les collections
        const collections = await db.listCollections().toArray();
        console.log("Collections disponibles:", collections.map(c => c.name));

        // Vérifier si l'admin existe déjà
        console.log("Vérification de l'existence de l'admin...");
        const users = await User.find();
        console.log("Utilisateurs existants:", users.map(u => ({ 
            email: u.email, 
            role: u.role,
            _id: u._id 
        })));

        const adminExists = await User.findOne({ email: "admin@portplaisance.fr" });

        if (adminExists) {
            console.log("L'administrateur existe déjà");
            await mongoose.disconnect();
            process.exit(0);
        }

        // Créer l'admin
        console.log("Création de l'administrateur...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("PortAdmin2024!", salt);

        const admin = await User.create({
            username: "Admin",
            email: "admin@portplaisance.fr",
            password: hashedPassword,
            role: "admin",
            nom: "Port",
            prenom: "Admin"
        });

        console.log("Administrateur créé avec succès !");
        console.log("Email:", admin.email);
        console.log("Mot de passe: PortAdmin2024!");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Erreur:", error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
};

createAdmin();
