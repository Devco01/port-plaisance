const mongoose = require("mongoose");

const connect = async () => {
    try {
        console.log("Tentative de connexion à MongoDB...");
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/port-russell";
        
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Test de la connexion
        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "Erreur de connexion MongoDB:"));
        db.once("open", () => {
            console.log("✅ Connexion MongoDB établie avec succès");
            // Test si la collection existe
            db.db.listCollections({ name: "reservations" })
                .next((err, collinfo) => {
                    if (err) {
                        console.error("Erreur lors de la vérification de la collection:", err);
                    }
                    if (!collinfo) {
                        console.warn("⚠️ La collection 'reservations' n'existe pas");
                    } else {
                        console.log("✅ Collection 'reservations' trouvée");
                    }
                });
        });

    } catch (error) {
        console.error("❌ Erreur lors de la connexion à MongoDB:", error);
        throw error;
    }
};

module.exports = {
    connect
};
