const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: true
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
        required: true,
        validate: {
            validator: function(v) {
                if (!this.isNew) return true;
                return v > new Date();
            },
            message: 'La date de début doit être future'
        }
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v > this.startDate;
            },
            message: 'La date de fin doit être après la date de début'
        }
    }
}, {
    timestamps: true
});

// Middleware pour vérifier les chevauchements
reservationSchema.pre('save', async function(next) {
    const overlapping = await this.constructor.findOne({
        catwayNumber: this.catwayNumber,
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
