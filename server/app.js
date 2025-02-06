const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
require("dotenv").config();
const database = require("./config/database");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const catwayRoutes = require("./routes/catwayRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();

// Configuration CORS
app.use(cors({
    origin: "http://localhost:3000", // URL de votre frontend
    credentials: true, // Pour permettre l'envoi de cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à la base de données
database.connect()
    .then(() => console.log("Connexion à MongoDB réussie"))
    .catch((err) => console.error("Erreur de connexion MongoDB:", err));

// Documentation API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", catwayRoutes);
app.use("/api", reservationRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Une erreur est survenue" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
