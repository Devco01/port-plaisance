const mongoose = require("mongoose");
const config = require("./config");

const connect = async () => {
    try {
        await mongoose.connect(config.db.uri, config.db.options);
        console.log("✅ Connecté à MongoDB");
    } catch (error) {
        console.error("❌ Erreur de connexion MongoDB:", error);
        process.exit(1);
    }
};

module.exports = {
    connect
};
