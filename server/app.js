var express = require("express");
var path = require("path");
var cors = require("cors");
var session = require("express-session");
var swaggerUi = require("swagger-ui-express");
var swaggerSpec = require("./config/swagger");
var errorHandler = require("./middleware/errorHandler");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var helmet = require("helmet");
var compression = require("compression");
require("dotenv").config();
var database = require("./config/database");

// Routes
var authRoutes = require("./routes/authRoutes");
var userRoutes = require("./routes/userRoutes");
var catwayRoutes = require("./routes/catwayRoutes");
var reservationRoutes = require("./routes/reservationRoutes");
var frontendRoutes = require("./routes/frontend");

var app = express();

// Configuration de la base de données
database
    .connect()
    .then(function () {
        console.log("Connexion à MongoDB réussie");
    })
    .catch(function (err) {
        console.error("Erreur de connexion MongoDB:", err);
    });

// Middlewares
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// Configuration EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Configuration des sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 24 heures
        }
    })
);

// Variables globales pour les vues
app.use(function (req, res, next) {
    res.locals.user = req.session.user || null;
    next();
});

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/catways", catwayRoutes);
app.use("/api/reservations", reservationRoutes);

// Routes Frontend
app.use("/", frontendRoutes);

// Servir les fichiers statiques du client en production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));

    // Route catch-all pour SPA
    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
}

// Gestion des erreurs 404
app.use(function (req, res, next) {
    res.status(404).render("error", {
        message: "Page non trouvée",
        error: { status: 404 }
    });
});

// Gestion des erreurs
app.use(errorHandler);

// Gestion des erreurs non capturées
process.on("unhandledRejection", function (reason, promise) {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", function (err) {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

module.exports = app;
