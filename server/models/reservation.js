var mongoose = require('mongoose');

var reservationSchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: true,
        ref: 'Catway'
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    boatName: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmée', 'annulée', 'en_attente'],
        default: 'en_attente'
    },
    totalPrice: {
        type: Number,
        min: 0
    },
    comments: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index pour optimiser les recherches de conflits
reservationSchema.index({ catwayNumber: 1, startDate: 1, endDate: 1 });

// Méthode pour vérifier si une période est disponible
reservationSchema.statics.checkAvailability = function(catwayNumber, startDate, endDate) {
    return this.findOne({
        catwayNumber: catwayNumber,
        status: { $ne: 'annulée' },
        $or: [
            {
                startDate: { $lte: endDate },
                endDate: { $gte: startDate }
            }
        ]
    }).exec();
};

// Méthode pour calculer le prix total
reservationSchema.methods.calculatePrice = function() {
    var days = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
    var basePrice = 50; // Prix par jour
    this.totalPrice = days * basePrice;
    return this.save();
};

// Méthode pour annuler une réservation
reservationSchema.methods.cancel = function() {
    this.status = 'annulée';
    return this.save();
};

var Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
