require("dotenv").config();
console.log("CheckAdmin - URL MongoDB:", process.env.MONGODB_URI);
var User = require("../models/user");

User.findOne({ role: "admin" })
    .then(function (admin) {
        if (!admin) {
            console.error(
                "❌ Aucun administrateur trouvé dans la base de données"
            );
            process.exit(1);
        }
        console.log("✅ Un administrateur existe dans la base de données");
        process.exit(0);
    })
    .catch(function (error) {
        console.error(
            "❌ Erreur lors de la vérification de l'administrateur:",
            error
        );
        process.exit(1);
    });
