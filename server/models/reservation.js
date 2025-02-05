var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var reservationSchema = new Schema({
    catwayNumber: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    clientName: {
        type: String,
        required: true
    },
    boatName: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (endDate) {
                return endDate > this.startDate;
            },
            message: "La date de fin doit être postérieure à la date de début"
        }
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Vérifie les chevauchements avant la sauvegarde
reservationSchema.pre("save", function (next) {
    var reservation = this;

    // Vérifie si les dates se chevauchent avec une réservation existante
    mongoose
        .model("Reservation")
        .findOne({
            catwayNumber: reservation.catwayNumber,
            _id: { $ne: reservation._id },
            $or: [
                {
                    startDate: { $lt: reservation.endDate },
                    endDate: { $gt: reservation.startDate }
                },
                {
                    startDate: { $lte: reservation.startDate },
                    endDate: { $gte: reservation.endDate }
                }
            ]
        })
        .then(function (existingReservation) {
            if (existingReservation) {
                next(
                    new Error(
                        "Chevauchement : une réservation existe déjà pour cette période"
                    )
                );
            } else {
                next();
            }
        })
        .catch(next);
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

module.exports = mongoose.model("Reservation", reservationSchema);
