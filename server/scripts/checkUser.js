const mongoose = require("mongoose");
const User = require("../models/user");


mongoose.connect("mongodb://localhost:27017/port-russell", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


async function updateUser(email) {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Utilisateur non trouvé");
            return;
        }

        // Mettre à jour l'utilisateur avec un nom d'utilisateur
        user.username = "Administrateur Port Russell";
        
        await user.save();
        console.log("Utilisateur mis à jour:", user);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

// Mettre à jour l'utilisateur admin
updateUser("admin@portplaisance.fr");
