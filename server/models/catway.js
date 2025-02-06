const mongoose = require("mongoose");

const catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: Number,
        required: true,
        unique: true
    },
    catwayType: {
        type: String,
        required: true,
        enum: ["long", "short"]
    },
    catwayState: {
        type: String,
        required: true,
        default: "bon état"
    },
    description: {
        type: String,
        trim: true
    },
    lastMaintenanceDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Empêcher la modification du type après création
catwaySchema.pre("save", function (next) {
    if (!this.isNew && this.isModified("catwayType")) {
        next(new Error("Le type de catway ne peut pas être modifié"));
    }
    next();
});

// Méthode pour vérifier la disponibilité
catwaySchema.methods.isAvailable = function () {
    return this.catwayState === "bon état";
};

// Méthode pour mettre à jour l'état
catwaySchema.methods.updateState = function (newState) {
    this.catwayState = newState;
    return this.save();
};

// Méthode pour enregistrer une maintenance
catwaySchema.methods.setMaintenance = function (date) {
    this.lastMaintenanceDate = date || new Date();
    this.catwayState = "En maintenance";
    return this.save();
};

const Catway = mongoose.model("Catway", catwaySchema);

module.exports = Catway;
