const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    nom: String,
    prenom: String
}, {
    timestamps: true
});

// Middleware pre-save pour hasher le mot de passe
userSchema.pre("save", async function(next) {
    // Ne hasher le mot de passe que s'il a été modifié
    if (!this.isModified("password")) {
        return next();
    }

    console.log("Pre-save middleware déclenché");
    console.log("Hachage du mot de passe...");
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log("Mot de passe haché avec succès");
        next();
    } catch (error) {
        console.error("Erreur lors du hachage du mot de passe:", error);
        next(error);
    }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        console.log("Comparaison des mots de passe pour:", this.email);
        console.log("Mot de passe fourni:", candidatePassword);
        console.log("Hash stocké:", this.password);
        
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log("Résultat de la comparaison:", isMatch);
        
        return isMatch;
    } catch (error) {
        console.error("Erreur lors de la comparaison des mots de passe:", error);
        throw error;
    }
};

// Méthode pour générer un objet public sans données sensibles
userSchema.methods.toPublic = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
