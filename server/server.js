const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});


// Vérification explicite
console.log("=== Configuration ===");
console.log("Fichier .env:", path.resolve(__dirname, "../.env"));
console.log("Base de données:", new URL(process.env.MONGODB_URI).pathname.split("/")[1]);

// Vérification des variables d'environnement requises
var _requiredEnvVars = ["JWT_SECRET", "PORT"];

if (!process.env.MONGODB_URI && !process.env.MONGODB_URL) {
    console.error("❌ Ni MONGODB_URI ni MONGODB_URL ne sont définis");
    process.exit(1);
}

// Log des variables d'environnement au démarrage
console.log("Variables d'environnement:", {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB: process.env.MONGODB_URL
        ? " Défini via MONGODB_URL"
        : process.env.MONGODB_URI
            ? " Défini via MONGODB_URI"
            : " Non défini",

    MONGODB_URL: process.env.MONGODB_URL,
    ENV_FILE: require("path").resolve(process.cwd(), ".env")
});

console.log("=== Vérification de la configuration ===");
console.log("Fichier .env chargé depuis:", require("path").resolve(__dirname, ".env"));
console.log("MONGODB_URI est défini:", !!process.env.MONGODB_URI);
console.log("URI MongoDB (masquée):", process.env.MONGODB_URI?.replace(/(mongodb\+srv:\/\/)[^:]+:[^@]+@/, "$1****:****@"));

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const connectDB = require("./config/db");
const checkAndCreateAdmin = require("./scripts/checkAdmin").checkAndCreateAdmin;
const mongoose = require("mongoose");

// Importer les routes
console.log("Chargement des routes utilisateurs...");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const catwayRoutes = require("./routes/catwayRoutes");
console.log("Routes utilisateurs chargées");

const app = express();

// Configuration CORS détaillée
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"]
}));

// Headers supplémentaires pour CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


// Parser JSON
app.use(express.json());

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/catways", catwayRoutes);

// Documentation API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Fichiers statiques et catch-all en dernier
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: err.message
    });
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connecté");
        // Vérifier/créer le compte admin
        return checkAndCreateAdmin();
    })
    .then(function () {
        // Toujours utiliser le port fourni par l'environnement en priorité
        var port = process.env.PORT || 3001;
        console.log("📌 Port demandé:", port);
        app.listen(port, "0.0.0.0", function () {
            console.log("🌍 Environnement:", process.env.NODE_ENV);
            console.log("🚀 Serveur démarré sur le port " + port);
            if (process.env.NODE_ENV === "production") {
                console.log(
                    "📝 Documentation API:",
                    "https://port-plaisance.onrender.com/api-docs"
                );
            }
        });
    })
    .catch(function (err) {
        console.error("❌ Erreur de connexion à MongoDB:", err);
        process.exit(1);
    });
