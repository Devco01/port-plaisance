const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, 'Le nom du client est requis']
    },
    boatName: {
        type: String,
        required: [true, 'Le nom du bateau est requis']
    },
    startDate: {
        type: Date,
        required: [true, 'La date de début est requise']
    },
    endDate: {
        type: Date,
        required: [true, 'La date de fin est requise']
    },
    catway: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Catway',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Vérifier que la date de fin est après la date de début
reservationSchema.pre('save', function(next) {
    if (this.endDate <= this.startDate) {
        next(new Error('La date de fin doit être après la date de début'));
    }
    next();
});

module.exports = mongoose.model('Reservation', reservationSchema); 