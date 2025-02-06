const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("=== Configuration de la connexion MongoDB ===");
        
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI n'est pas défini dans les variables d'environnement");
        }

        // Masquer les informations sensibles dans les logs
        const maskedURI = process.env.MONGODB_URI.replace(
            /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
            "mongodb+srv://****:****@"
        );
        console.log("URI (masquée):", maskedURI);

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("✅ MongoDB connecté:", conn.connection.host);
        return conn;
    } catch (error) {
        console.error("❌ Erreur de connexion MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
