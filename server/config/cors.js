const corsOptions = {
    origin: ["http://localhost:8080", "http://localhost:3000"], // Ajout des origines possibles
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept"
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],

    maxAge: 86400 // 24 heures
};

module.exports = corsOptions; 