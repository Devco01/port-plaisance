const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: [true, "Le numéro de catway est requis"],
        ref: "Catway"
    },
    clientName: {
        type: String,
        required: [true, "Le nom du client est requis"],
        trim: true
    },
    boatName: {
        type: String,
        required: [true, "Le nom du bateau est requis"],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, "La date de début est requise"]
    },
    endDate: {
        type: Date,
        required: [true, "La date de fin est requise"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        // Pas required car on peut avoir des réservations sans utilisateur
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    }
}, {
    timestamps: true
});

// Middleware pour normaliser les dates avant la sauvegarde
reservationSchema.pre("save", function(next) {
    if (this.startDate) {
        this.startDate.setHours(0, 0, 0, 0);
    }
    if (this.endDate) {
        this.endDate.setHours(23, 59, 59, 999);
    }
    next();
});

// Vérifie que la date de fin est après la date de début
reservationSchema.pre("save", function (next) {
    if (this.endDate <= this.startDate) {
        next(new Error("La date de fin doit être après la date de début"));
    }
    next();
});

// Vérifie les chevauchements avant la sauvegarde
reservationSchema.pre("save", async function (next) {
    try {
        console.log("=== Vérification des chevauchements ===");
        console.log("Nouvelle réservation:", {
            catwayNumber: this.catwayNumber,
            startDate: this.startDate,
            endDate: this.endDate
        });
        
        const conflictingReservation = await this.constructor.findOne({
            catwayNumber: this.catwayNumber,
            _id: { $ne: this._id },
            $or: [
                {
                    startDate: { $lt: this.endDate },
                    endDate: { $gt: this.startDate }
                }
            ]
        });

        if (conflictingReservation) {
            console.log("Réservation en conflit trouvée:", {
                id: conflictingReservation._id,
                catwayNumber: conflictingReservation.catwayNumber,
                startDate: conflictingReservation.startDate,
                endDate: conflictingReservation.endDate
            });
            next(new Error(`Le catway ${this.catwayNumber} est déjà réservé du ${new Date(conflictingReservation.startDate).toLocaleDateString("fr-FR")} au ${new Date(conflictingReservation.endDate).toLocaleDateString("fr-FR")}`));
        } else {
            console.log("Aucun conflit trouvé");
            next();
        }
    } catch (error) {
        console.error("Erreur lors de la vérification des chevauchements:", error);
        next(error);
    }
});

// Vérifier la disponibilité du catway
reservationSchema.statics.checkAvailability = function (
    catwayNumber,
    startDate,
    endDate
) {
    return this.find({
        catwayNumber: catwayNumber,
        status: "confirmed",
        $or: [
            {
                startDate: { $lte: endDate },
                endDate: { $gte: startDate }
            }
        ]
    }).exec();
};

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
