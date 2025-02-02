const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    catwayId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Catway',
        required: [true, 'Le catway est requis']
    },
    catwayNumber: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: [true, 'Le nom du client est requis'],
        trim: true,
        minlength: [2, 'Le nom doit contenir au moins 2 caractères']
    },
    boatName: {
        type: String,
        required: [true, 'Le nom du bateau est requis'],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'La date de début est requise'],
        validate: {
            validator: function(date) {
                return date >= new Date();
            },
            message: 'La date de début doit être future'
        }
    },
    endDate: {
        type: Date,
        required: [true, 'La date de fin est requise'],
        validate: {
            validator: function(date) {
                return date > this.startDate;
            },
            message: 'La date de fin doit être postérieure à la date de début'
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Middleware pour vérifier les chevauchements
reservationSchema.pre('save', async function(next) {
    const overlapping = await this.constructor.findOne({
        catwayId: this.catwayId,
        _id: { $ne: this._id },
        $or: [
            {
                startDate: { $lte: this.endDate },
                endDate: { $gte: this.startDate }
            }
        ]
    });

    if (overlapping) {
        throw new Error('Il existe déjà une réservation pour cette période');
    }
    next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
